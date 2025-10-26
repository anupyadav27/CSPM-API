import Tenant from "../models/Tenant.js";
import AuditLog from "../models/AuditLog.js";
import runTransaction from "./transactionControl.js";
import TenantUser from "../models/tenantUser.js";
import User from "../models/user.js";

const tenantServices = {
    async createTenant(data, createdBy = null) {
        return runTransaction(async (session) => {
            const tenant = new Tenant(data);
            await tenant.save({ session });

            await AuditLog.create(
                [
                    {
                        action: "create_tenant",
                        entityType: "Tenant",
                        entityId: tenant._id,
                        userId: createdBy,
                        description: `Tenant '${tenant.name}' created.`,
                        severity: "info",
                        metadata: { tenantData: data },
                    },
                ],
                { session }
            );

            return tenant.toObject();
        });
    },

    async getTenantById(id) {
        return await Tenant.findById(id).lean();
    },

    async getTenantByName(name) {
        return await Tenant.findOne({ name }).lean();
    },

    async getAllTenants(filters = {}, pagination = {}) {
        try {
            let tenants, total;

            if (pagination.enabled) {
                const { skip, pageSize } = pagination;
                [tenants, total] = await Promise.all([
                    Tenant.find(filters).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
                    Tenant.countDocuments(filters),
                ]);

                return {
                    tenants,
                    pagination: {
                        total,
                        pageSize,
                        currentPage: Math.floor(skip / pageSize) + 1,
                        totalPages: Math.ceil(total / pageSize),
                    },
                };
            } else {
                tenants = await Tenant.find(filters).sort({ createdAt: -1 }).lean();
                total = tenants.length;
                return {
                    tenants,
                    pagination: {
                        total,
                        pageSize: total,
                        currentPage: 1,
                        totalPages: 1,
                    },
                };
            }
        } catch (error) {
            console.error("Error fetching tenants:", error);
            throw error;
        }
    },

    async updateTenant(id, updates, updatedBy = null) {
        return runTransaction(async (session) => {
            const oldTenant = await Tenant.findById(id).lean();
            if (!oldTenant) throw new Error("Tenant not found");

            const tenant = await Tenant.findByIdAndUpdate(id, updates, {
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
                        metadata: { before: oldTenant, after: tenant },
                    },
                ],
                { session }
            );

            return tenant;
        });
    },

    async deleteTenant(id, deletedBy = null, softDelete = false) {
        return runTransaction(async (session) => {
            let tenant;

            if (softDelete) {
                tenant = await Tenant.findByIdAndUpdate(
                    id,
                    { status: "inactive" },
                    { new: true, session }
                ).lean();
            } else {
                tenant = await Tenant.findByIdAndDelete(id, { session }).lean();
            }

            if (!tenant) throw new Error("Tenant not found");

            await AuditLog.create(
                [
                    {
                        action: softDelete ? "soft_delete_tenant" : "delete_tenant",
                        entityType: "Tenant",
                        entityId: tenant._id,
                        userId: deletedBy,
                        description: `Tenant '${tenant.name}' ${softDelete ? "soft-deleted" : "deleted"}.`,
                        severity: softDelete ? "warning" : "critical",
                        metadata: { tenantId: id },
                    },
                ],
                { session }
            );

            return tenant;
        });
    },

    async updateTenantStatus(id, status, updatedBy = null) {
        return runTransaction(async (session) => {
            const oldTenant = await Tenant.findById(id).lean();
            if (!oldTenant) throw new Error("Tenant not found");

            const tenant = await Tenant.findByIdAndUpdate(
                id,
                { status },
                { new: true, session }
            ).lean();

            await AuditLog.create(
                [
                    {
                        action: "update_tenant_status",
                        entityType: "Tenant",
                        entityId: tenant._id,
                        userId: updatedBy,
                        description: `Tenant '${tenant.name}' status updated to '${status}'.`,
                        severity: "info",
                        metadata: { before: oldTenant.status, after: status },
                    },
                ],
                { session }
            );

            return tenant;
        });
    },

    async updateTenantBilling(id, billingData, updatedBy = null) {
        return runTransaction(async (session) => {
            const oldTenant = await Tenant.findById(id).lean();
            if (!oldTenant) throw new Error("Tenant not found");

            const tenant = await Tenant.findByIdAndUpdate(
                id,
                { billing: billingData },
                { new: true, session }
            ).lean();

            await AuditLog.create(
                [
                    {
                        action: "update_tenant_billing",
                        entityType: "Tenant",
                        entityId: tenant._id,
                        userId: updatedBy,
                        description: `Tenant '${tenant.name}' billing updated.`,
                        severity: "info",
                        metadata: { before: oldTenant.billing, after: tenant.billing },
                    },
                ],
                { session }
            );

            return tenant;
        });
    },
    async getTenantsByUserId(userId, pagination = {}) {
        const tenantMappings = await TenantUser.find({ userId }).lean();

        if (!tenantMappings.length) {
            return {
                tenants: [],
                pagination: { total: 0, pageSize: 0, currentPage: 1, totalPages: 0 },
            };
        }

        const tenantIds = tenantMappings.map((t) => t.tenantId);

        let tenants, total;

        if (pagination.enabled) {
            const { skip, pageSize } = pagination;

            [tenants, total] = await Promise.all([
                Tenant.find({ _id: { $in: tenantIds } })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(pageSize)
                    .lean(),
                Tenant.countDocuments({ _id: { $in: tenantIds } }),
            ]);

            return {
                tenants,
                pagination: {
                    total,
                    pageSize,
                    currentPage: Math.floor(skip / pageSize) + 1,
                    totalPages: Math.ceil(total / pageSize),
                },
            };
        } else {
            tenants = await Tenant.find({ _id: { $in: tenantIds } })
                .sort({ createdAt: -1 })
                .lean();

            total = tenants.length;

            return {
                tenants,
                pagination: { total, pageSize: total, currentPage: 1, totalPages: 1 },
            };
        }
    },

    async searchTenants(searchText, pagination = {}) {
        const searchQuery = {
            $or: [
                { name: { $regex: searchText, $options: "i" } },
                { description: { $regex: searchText, $options: "i" } },
                { contactEmail: { $regex: searchText, $options: "i" } },
            ],
        };

        return this.getAllTenants(searchQuery, pagination);
    },

    async getTenantsByPlan(plan, pagination = {}) {
        return this.getAllTenants({ plan }, pagination);
    },

    async getActiveTenants(pagination = {}) {
        return this.getAllTenants({ status: "active" }, pagination);
    },

    async countTenantsByStatus() {
        const result = await Tenant.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        return result.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});
    },

    async getTenantWithUsers(id) {
        const tenant = await Tenant.findById(id).lean();
        if (!tenant) return null;

        const tenantUsers = await TenantUser.find({ tenantId: id })
            .lean()
            .select("userId roles status joinedAt");

        if (!tenantUsers.length) {
            return { ...tenant, users: [] };
        }

        const userIds = tenantUsers.map((tu) => tu.userId);
        const users = await User.find({ _id: { $in: userIds } })
            .lean()
            .select("email name roles status lastLogin");

        const usersWithTenantRoles = tenantUsers
            .map((tu) => {
                const user = users.find((u) => u._id.toString() === tu.userId.toString());
                if (!user) return null;
                return {
                    ...user,
                    tenantRoles: tu.roles,
                    tenantStatus: tu.status,
                    joinedAt: tu.joinedAt,
                };
            })
            .filter(Boolean);

        return { ...tenant, users: usersWithTenantRoles };
    },
};

export default tenantServices;
