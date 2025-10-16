import mongoose from "mongoose";
import Tenant from "../models/tenant.js";
import User from "../models/user.js";
import AuditLog from "../models/auditLog.js";

const runTransaction = async (operations) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const result = await operations(session);
		await session.commitTransaction();
		await session.endSession();
		return result;
	} catch (error) {
		await session.abortTransaction();
		await session.endSession();
		console.error("Tenant transaction failed:", error);
		throw error;
	}
};

export const getAllTenants = async (filters = {}) => {
	try {
		return await Tenant.find(filters).lean();
	} catch (error) {
		console.error("Error fetching tenants:", error);
		throw error;
	}
};

export const getTenantById = async (tenantId) => {
	try {
		return await Tenant.findById(tenantId).lean();
	} catch (error) {
		console.error("Error fetching tenant:", error);
		throw error;
	}
};

export const createTenant = async (tenantData, adminUserData = null, createdBy = null) => {
	return runTransaction(async (session) => {
		const tenant = new Tenant(tenantData);
		await tenant.save({session});
		
		let adminUser = null;
		
		if (adminUserData) {
			adminUser = new User({
				...adminUserData,
				tenantId: tenant._id,
				role: adminUserData.role || "admin",
			});
			await adminUser.save({session});
		}
		
		await AuditLog.create(
			[
				{
					action: "create_tenant",
					entityType: "Tenant",
					entityId: tenant._id,
					userId: createdBy,
					description: `Tenant '${tenant.name}' created${adminUser ? ` with admin '${adminUser.email}'` : ""}.`,
					severity: "info",
					metadata: {
						tenantId: tenant._id,
						adminUserId: adminUser?._id || null,
					},
				},
			],
			{session}
		);
		
		return {
			tenant: tenant.toObject(),
			adminUser: adminUser?.toObject() || null,
		};
	});
};

export const updateTenant = async (tenantId, updates, updatedBy = null) => {
	return runTransaction(async (session) => {
		const oldTenant = await Tenant.findById(tenantId).lean();
		if (!oldTenant) throw new Error("Tenant not found");
		
		const tenant = await Tenant.findByIdAndUpdate(tenantId, updates, {
			new: true,
			runValidators: true,
			session,
		}).lean();
		
		await AuditLog.create(
			[
				{
					action: "update_tenant",
					entityType: "Tenant",
					entityId: tenant._id,
					userId: updatedBy,
					description: `Tenant '${tenant.name}' updated.`,
					severity: "info",
					metadata: {
						before: oldTenant,
						after: tenant,
					},
				},
			],
			{session}
		);
		
		return tenant;
	});
};

export const deleteTenant = async (tenantId, deletedBy = null, cascade = false) => {
	return runTransaction(async (session) => {
		const tenant = await Tenant.findById(tenantId).session(session);
		if (!tenant) throw new Error("Tenant not found");
		
		await Tenant.deleteOne({_id: tenantId}, {session});
		
		let deletedUsers = [];
		if (cascade) {
			deletedUsers = await User.find({tenantId}).select("_id email").lean();
			await User.deleteMany({tenantId}, {session});
		}
		
		await AuditLog.create(
			[
				{
					action: "delete_tenant",
					entityType: "Tenant",
					entityId: tenantId,
					userId: deletedBy,
					description: `Tenant '${tenant.name}' deleted${cascade ? " with cascading user deletion" : ""}.`,
					severity: "warning",
					metadata: {
						tenantId,
						cascade,
						deletedUsers: deletedUsers.map((u) => ({id: u._id, email: u.email})),
					},
				},
			],
			{session}
		);
		
		return tenant.toObject();
	});
};

export const getTenantUsers = async (tenantId, filters = {}) => {
	try {
		return await User.find({tenantId, ...filters}).lean();
	} catch (error) {
		console.error("Error fetching tenant users:", error);
		throw error;
	}
};

export const addUserToTenant = async (tenantId, userData, addedBy = null) => {
	return runTransaction(async (session) => {
		const tenant = await Tenant.findById(tenantId).session(session);
		if (!tenant) throw new Error("Tenant not found");
		
		const user = new User({...userData, tenantId});
		await user.save({session});
		
		await AuditLog.create(
			[
				{
					action: "add_user_to_tenant",
					entityType: "User",
					entityId: user._id,
					userId: addedBy,
					description: `User '${user.email}' added to tenant '${tenant.name}'.`,
					severity: "info",
					metadata: {
						tenantId,
						userId: user._id,
					},
				},
			],
			{session}
		);
		
		return user.toObject();
	});
};
