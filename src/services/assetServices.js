import mongoose from "mongoose";

import Asset from "../models/asset.js";
import User from "../models/user.js";
import auditLogServices from "../services/auditLogServices.js";

const assetServices = {
    async createAsset(data, userId, req = {}) {
        try {
            if (!data?.tenantId) throw new Error("tenantId is required");

            const asset = await Asset.create({
                ...data,
                createdBy: userId ? new mongoose.Types.ObjectId(userId) : undefined,
            });

            await auditLogServices.createLog({
                tenantId: asset.tenantId,
                userId,
                action: "create",
                entityType: "Asset",
                entityId: asset._id,
                description: `Created asset ${asset.name}`,
                after: asset.toObject(),
                req,
            });

            return { success: true, asset };
        } catch (err) {
            console.error("Error creating asset:", err);
            throw err;
        }
    },

    async getAllAssets(filters = {}, pagination = {}) {
        try {
            let assets, total;
            const query = Asset.find(filters)
                .sort({ createdAt: -1 })
                .populate({ path: "tenantId", select: "_id name" });

            if (pagination.enabled) {
                const { skip, pageSize } = pagination;
                [assets, total] = await Promise.all([
                    query.skip(skip).limit(pageSize).lean(),
                    Asset.countDocuments(filters),
                ]);
            } else {
                assets = await query;
                total = assets.length;
            }

            return {
                assets,
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
            console.error("Error fetching assets:", err);
            throw err;
        }
    },

    async getAssetsByTenant(tenantId, filters = {}, pagination = {}) {
        try {
            if (!tenantId) throw new Error("tenantId is required");

            const query = Asset.find({ tenantId, ...filters }).sort({ createdAt: -1 });

            if (pagination.enabled) {
                const { skip, pageSize } = pagination;
                const [assets, total] = await Promise.all([
                    query.skip(skip).limit(pageSize).lean(),
                    Asset.countDocuments({ tenantId, ...filters }),
                ]);

                return {
                    success: true,
                    assets,
                    pagination: {
                        total,
                        pageSize,
                        currentPage: Math.floor(skip / pageSize) + 1,
                        totalPages: Math.ceil(total / pageSize),
                    },
                };
            }

            const assets = await query.lean();
            return { success: true, assets };
        } catch (err) {
            console.error("Error fetching assets by tenant:", err);
            throw err;
        }
    },

    async getAssetsByUser(userId, filters = {}, pagination = {}) {
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

            let query = Asset.find(filters).sort({ createdAt: -1 });
            if (!unrestricted && accessibleTenantIds.length) {
                query = query.where("tenantId").in(accessibleTenantIds);
            }

            if (pagination.enabled) {
                const { skip, pageSize } = pagination;
                const [assets, total] = await Promise.all([
                    query.skip(skip).limit(pageSize).lean(),
                    query.model.countDocuments(query.getFilter()),
                ]);

                return {
                    success: true,
                    assets,
                    pagination: {
                        total,
                        pageSize,
                        currentPage: Math.floor(skip / pageSize) + 1,
                        totalPages: Math.ceil(total / pageSize),
                    },
                };
            }

            const assets = await query.lean();
            return { success: true, assets };
        } catch (err) {
            console.error("Error fetching assets by user:", err);
            throw err;
        }
    },

    async getAssetsByTenantAndUser(tenantId, userId, filters = {}, pagination = {}) {
        try {
            if (!tenantId || !userId) throw new Error("tenantId and userId are required");

            const user = await User.findById(userId)
                .populate({ path: "roles", select: "_id name tenantScoped" })
                .lean();

            if (!user) throw new Error("User not found");

            let authorized = false;

            if (user.roles.some((r) => ["admin", "super_admin"].includes(r.name))) {
                authorized = true;
            } else if (
                user.roles.some((r) => r.tenantScoped) &&
                user.metadata?.tenants?.includes(String(tenantId))
            ) {
                authorized = true;
            }

            if (!authorized) throw new Error("User not authorized for this tenant");

            const query = Asset.find({ tenantId, ...filters }).sort({ createdAt: -1 });

            if (pagination.enabled) {
                const { skip, pageSize } = pagination;
                const [assets, total] = await Promise.all([
                    query.skip(skip).limit(pageSize).lean(),
                    Asset.countDocuments({ tenantId, ...filters }),
                ]);

                return {
                    success: true,
                    assets,
                    pagination: {
                        total,
                        pageSize,
                        currentPage: Math.floor(skip / pageSize) + 1,
                        totalPages: Math.ceil(total / pageSize),
                    },
                };
            }

            const assets = await query.lean();
            return { success: true, assets };
        } catch (err) {
            console.error("Error fetching assets by tenant and user:", err);
            throw err;
        }
    },

    async updateAsset(assetId, updateData, userId, req = {}) {
        try {
            if (!assetId) throw new Error("assetId is required");

            const before = await Asset.findById(assetId).lean();
            if (!before) throw new Error("Asset not found");

            const updated = await Asset.findByIdAndUpdate(
                assetId,
                {
                    $set: {
                        ...updateData,
                        updatedBy: userId ? new mongoose.Types.ObjectId(userId) : undefined,
                    },
                },
                { new: true, runValidators: true, lean: true }
            );

            await auditLogServices.createLog({
                tenantId: before.tenantId,
                userId,
                action: "update",
                entityType: "Asset",
                entityId: assetId,
                description: `Updated asset ${before.name}`,
                before,
                after: updated,
                req,
            });

            return { success: true, asset: updated };
        } catch (err) {
            console.error("Error updating asset:", err);
            throw err;
        }
    },

    async deleteAsset(assetId, userId, req = {}) {
        try {
            if (!assetId) throw new Error("assetId is required");

            const before = await Asset.findById(assetId).lean();
            if (!before) throw new Error("Asset not found");

            await Asset.findByIdAndDelete(assetId);

            await auditLogServices.createLog({
                tenantId: before.tenantId,
                userId,
                action: "delete",
                entityType: "Asset",
                entityId: assetId,
                description: `Deleted asset ${before.name}`,
                before,
                req,
                severity: "warning",
            });

            return {
                success: true,
                message: `Asset ${before.name || assetId} deleted successfully`,
            };
        } catch (err) {
            console.error("Error deleting asset:", err);
            throw err;
        }
    },
};

export default assetServices;
