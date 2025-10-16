import mongoose from "mongoose";
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
		console.error("User transaction failed:", error);
		throw error;
	}
};

export const getAllUsers = async (filters = {}) => {
	try {
		return await User.find(filters).lean();
	} catch (error) {
		console.error("Error fetching users:", error);
		throw error;
	}
};

export const getUserById = async (userId) => {
	try {
		return await User.findById(userId).lean();
	} catch (error) {
		console.error("Error fetching user by ID:", error);
		throw error;
	}
};

export const createUser = async (userData, createdBy = null) => {
	return runTransaction(async (session) => {
		const user = new User(userData);
		await user.save({ session });

		await AuditLog.create(
			[
				{
					action: "create_user",
					entityType: "User",
					entityId: user._id,
					userId: createdBy,
					description: `User '${user.email}' created.`,
					severity: "info",
					metadata: { userData },
				},
			],
			{ session }
		);

		return user.toObject();
	});
};

export const updateUser = async (userId, updates, updatedBy = null) => {
	return runTransaction(async (session) => {
		const oldUser = await User.findById(userId).lean();
		if (!oldUser) throw new Error("User not found");

		const user = await User.findByIdAndUpdate(userId, updates, {
			new: true,
			runValidators: true,
			session,
		}).lean();

		await AuditLog.create(
			[
				{
					action: "update_user",
					entityType: "User",
					entityId: user._id,
					userId: updatedBy,
					description: `User '${user.email}' updated.`,
					severity: "info",
					metadata: { before: oldUser, after: user },
				},
			],
			{ session }
		);

		return user;
	});
};

export const deleteUser = async (userId, deletedBy = null, softDelete = false) => {
	return runTransaction(async (session) => {
		let user;

		if (softDelete) {
			user = await User.findByIdAndUpdate(
				userId,
				{ status: "inactive" },
				{ new: true, session }
			).lean();
		} else {
			user = await User.findByIdAndDelete(userId, { session }).lean();
		}

		if (!user) throw new Error("User not found");

		await AuditLog.create(
			[
				{
					action: softDelete ? "soft_delete_user" : "delete_user",
					entityType: "User",
					entityId: user._id,
					userId: deletedBy,
					description: `User '${user.email}' ${softDelete ? "soft-deleted" : "deleted"}.`,
					severity: softDelete ? "warning" : "critical",
					metadata: { userId },
				},
			],
			{ session }
		);

		return user;
	});
};

export const recordLogin = async (userId, ip, userAgent, recordedBy = null) => {
	return runTransaction(async (session) => {
		const update = {
			lastLogin: new Date(),
			$push: {
				loginHistory: {
					timestamp: new Date(),
					ip,
					userAgent,
				},
			},
		};

		const user = await User.findByIdAndUpdate(userId, update, {
			new: true,
			session,
		}).lean();

		await AuditLog.create(
			[
				{
					action: "record_login",
					entityType: "User",
					entityId: user._id,
					userId: recordedBy || user._id,
					description: `User '${user.email}' logged in.`,
					severity: "info",
					metadata: { ip, userAgent },
				},
			],
			{ session }
		);

		return user;
	});
};

export const updatePreferences = async (userId, preferences, updatedBy = null) => {
	return runTransaction(async (session) => {
		const oldUser = await User.findById(userId).lean();
		if (!oldUser) throw new Error("User not found");

		const user = await User.findByIdAndUpdate(
			userId,
			{ preferences },
			{ new: true, runValidators: true, session }
		).lean();

		await AuditLog.create(
			[
				{
					action: "update_user_preferences",
					entityType: "User",
					entityId: user._id,
					userId: updatedBy,
					description: `User '${user.email}' preferences updated.`,
					severity: "info",
					metadata: { before: oldUser.preferences, after: preferences },
				},
			],
			{ session }
		);

		return user;
	});
};
