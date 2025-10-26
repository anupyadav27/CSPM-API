import mongoose from "mongoose";

import Compliance from "../models/compliance.js";
import User from "../models/user.js";
import auditLogServices from "../services/auditLogServices.js";

const complianceServices = {
    async createCompliance(data, userId, req = {}) {
        try {
            if (!data?.tenantId) throw new Error("tenantId is required");

            const compliance = await Compliance.create({
                ...data,
                createdBy: userId ? new mongoose.Types.ObjectId(userId) : undefined,
            });

            await auditLogServices.createLog({
                tenantId: compliance.tenantId,
                userId,
                action: "create",
                entityType: "Compliance",
                entityId: compliance._id,
                description: `Created compliance control ${compliance.controlId} (${compliance.framework})`,
                after: compliance.toObject(),
                req,
            });

            return { success: true, compliance };
        } catch (err) {
            console.error("Error creating compliance:", err);
            throw err;
        }
    },

    async getAllCompliances(filters = {}, pagination = {}) {
        try {
            const query = Compliance.find(filters)
                .sort({ createdAt: -1 })
                .populate({ path: "tenantId", select: "_id name" });

            let compliances, total;

            if (pagination.enabled) {
                const { skip, pageSize } = pagination;
                [compliances, total] = await Promise.all([
                    query.skip(skip).limit(pageSize).lean(),
                    Compliance.countDocuments(filters),
                ]);
            } else {
                compliances = await query.lean();
                total = compliances.length;
            }

            return {
                compliances,
                pagination: {
                    total,
                    pageSize: pagination.enabled ? pagination.pageSize : total,
                    currentPage: pagination.enabled
                        ? Math.floor(pagination.skip / pagination.pageSize) + 1
                        : 1,
                    totalPages: pagination.enabled ? Math.ceil(total / pagination.pageSize) : 1,
                },
            };
        } catch (err) {
            console.error("Error fetching compliances:", err);
            throw err;
        }
    },

    async getCompliancesByTenant(tenantId, filters = {}, pagination = {}) {
        try {
            if (!tenantId) throw new Error("tenantId is required");

            const query = Compliance.find({ tenantId, ...filters }).sort({ createdAt: -1 });

            if (pagination.enabled) {
                const { skip, pageSize } = pagination;
                const [compliances, total] = await Promise.all([
                    query.skip(skip).limit(pageSize).lean(),
                    Compliance.countDocuments({ tenantId, ...filters }),
                ]);

                return {
                    success: true,
                    compliances,
                    pagination: {
                        total,
                        pageSize,
                        currentPage: Math.floor(skip / pageSize) + 1,
                        totalPages: Math.ceil(total / pageSize),
                    },
                };
            }

            const compliances = await query.lean();
            return { success: true, compliances };
        } catch (err) {
            console.error("Error fetching compliances by tenant:", err);
            throw err;
        }
    },

    async getCompliancesByUser(userId, filters = {}, pagination = {}) {
        try {
            if (!userId) throw new Error("userId is required");

            const user = await User.findById(userId)
                .populate({ path: "roles", select: "_id name tenantScoped" })
                .lean();

            if (!user) throw new Error("User not found");

            let accessibleTenantIds = [];
            let unrestricted = false;

            if (user.roles.some((r) => ["admin", "super_admin"].includes(r.name))) {
                unrestricted = true;
            } else if (user.roles.some((r) => r.tenantScoped)) {
                if (user.metadata?.tenants?.length) {
                    accessibleTenantIds = user.metadata.tenants.map(
                        (id) => new mongoose.Types.ObjectId(id)
                    );
                }
            }

            let query = Compliance.find(filters).sort({ createdAt: -1 });
            if (!unrestricted && accessibleTenantIds.length) {
                query = query.where("tenantId").in(accessibleTenantIds);
            }

            if (pagination.enabled) {
                const { skip, pageSize } = pagination;
                const [compliances, total] = await Promise.all([
                    query.skip(skip).limit(pageSize).lean(),
                    query.model.countDocuments(query.getFilter()),
                ]);

                return {
                    success: true,
                    compliances,
                    pagination: {
                        total,
                        pageSize,
                        currentPage: Math.floor(skip / pageSize) + 1,
                        totalPages: Math.ceil(total / pageSize),
                    },
                };
            }

            const compliances = await query.lean();
            return { success: true, compliances };
        } catch (err) {
            console.error("Error fetching compliances by user:", err);
            throw err;
        }
    },

    async updateCompliance(complianceId, updateData, userId, req = {}) {
        try {
            if (!complianceId) throw new Error("complianceId is required");

            const before = await Compliance.findById(complianceId).lean();
            if (!before) throw new Error("Compliance record not found");

            const updated = await Compliance.findByIdAndUpdate(
                complianceId,
                { $set: { ...updateData } },
                { new: true, runValidators: true, lean: true }
            );

            await auditLogServices.createLog({
                tenantId: before.tenantId,
                userId,
                action: "update",
                entityType: "Compliance",
                entityId: complianceId,
                description: `Updated compliance control ${before.controlId} (${before.framework})`,
                before,
                after: updated,
                req,
            });

            return { success: true, compliance: updated };
        } catch (err) {
            console.error("Error updating compliance:", err);
            throw err;
        }
    },

    async deleteCompliance(complianceId, userId, req = {}) {
        try {
            if (!complianceId) throw new Error("complianceId is required");

            const before = await Compliance.findById(complianceId).lean();
            if (!before) throw new Error("Compliance record not found");

            await Compliance.findByIdAndDelete(complianceId);

            await auditLogServices.createLog({
                tenantId: before.tenantId,
                userId,
                action: "delete",
                entityType: "Compliance",
                entityId: complianceId,
                description: `Deleted compliance control ${before.controlId} (${before.framework})`,
                before,
                req,
                severity: "warning",
            });

            return {
                success: true,
                message: `Compliance control ${before.controlId || complianceId} deleted successfully`,
            };
        } catch (err) {
            console.error("Error deleting compliance:", err);
            throw err;
        }
    },
};

export default complianceServices;
