import { Op } from "sequelize";

import auditLogServices from "./auditLogServices.js";
import { models } from "../config/db.js";
import { ASSOCIATION_MAP } from "../associations/assetsAssociation.js";
import { serviceHelpers } from "../utils/service-helpers.js";

const { buildFilters, parseNestedField, buildIncludes, buildOrderClause } = serviceHelpers(ASSOCIATION_MAP);

const auditService = auditLogServices();

const assetServices = () => {
    const getAllAssets = async (filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
        try {
            const { where, joinKeys } = buildFilters(filters, searchFields);

            for (const key of Object.keys(sort)) {
                const { associationPath } = parseNestedField(key);
                if (associationPath.length > 0) joinKeys.add(associationPath[0]);
            }

            joinKeys.add("tenants");

            const include = buildIncludes(joinKeys);
            const order = buildOrderClause(sort);

            const limit = pagination.enabled ? pagination.pageSize : undefined;
            const offset = pagination.enabled ? pagination.skip : undefined;

            const { count, rows: assets } = await models.assets.findAndCountAll({
                where,
                include,
                order,
                limit,
                offset,
                distinct: true,
            });

            const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

            return {
                assets,
                pagination: {
                    total: count,
                    currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                    totalPages,
                    pageSize: pagination.enabled ? limit : count,
                },
            };
        } catch (error) {
            console.info("Error in getAllAssets:", error);
            throw error;
        }
    };

    const getAssetById = async (id) => {
        return await models.assets.findByPk(id, {
            include: [ASSOCIATION_MAP.tenants, ASSOCIATION_MAP.asset_tags, ASSOCIATION_MAP.asset_compliance, ASSOCIATION_MAP.asset_threats],
        });
    };

    const createAsset = async (assetData, userId = null) => {
        try {
            const asset = await models.assets.create(assetData);

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: asset.tenant_id,
                    user_id: userId,
                    action: "CREATE",
                    entity_type: "asset",
                    entity_id: asset.id,
                    description: `Asset created: ${asset.name}`,
                    severity: "info",
                    source: "user",
                });
            }

            return asset;
        } catch (error) {
            console.info("Error creating asset:", error);
            throw error;
        }
    };

    const updateAsset = async (id, assetData, userId = null) => {
        try {
            const asset = await models.assets.findByPk(id);
            if (!asset) {
                throw new Error("Asset not found");
            }

            const oldAsset = { ...asset.toJSON() };
            await models.assets.update(assetData, { where: { id } });
            const updatedAsset = await models.assets.findByPk(id);

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: updatedAsset.tenant_id,
                    user_id: userId,
                    action: "UPDATE",
                    entity_type: "asset",
                    entity_id: updatedAsset.id,
                    description: `Asset updated: ${updatedAsset.name}`,
                    before_state: JSON.stringify(oldAsset),
                    after_state: JSON.stringify(updatedAsset.toJSON()),
                    severity: "info",
                    source: "user",
                });
            }

            return updatedAsset;
        } catch (error) {
            console.info("Error updating asset:", error);
            throw error;
        }
    };

    const deleteAsset = async (id, userId = null) => {
        try {
            const asset = await models.assets.findByPk(id);
            if (!asset) {
                throw new Error("Asset not found");
            }

            const deletedRowsCount = await models.assets.destroy({
                where: { id },
            });

            if (deletedRowsCount === 0) {
                throw new Error("Asset not found");
            }

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: asset.tenant_id,
                    user_id: userId,
                    action: "DELETE",
                    entity_type: "asset",
                    entity_id: asset.id,
                    description: `Asset deleted: ${asset.name}`,
                    severity: "info",
                    source: "user",
                });
            }

            return { message: "Asset deleted successfully" };
        } catch (error) {
            console.info("Error deleting asset:", error);
            throw error;
        }
    };

    const getAssetsWithTag = async (tagKey, tagValue = null, filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
        const tagFilters = { tag_key: tagKey };
        if (tagValue) tagFilters.tag_value = tagValue;

        const { where, joinKeys } = buildFilters(filters, searchFields);

        for (const key of Object.keys(sort)) {
            const { associationPath } = parseNestedField(key);
            if (associationPath.length > 0) joinKeys.add(associationPath[0]);
        }

        joinKeys.add("tenants");
        joinKeys.add("asset_tags");

        const include = buildIncludes(joinKeys);

        const tagInclude = include.find((i) => i.as === "asset_tags");
        if (tagInclude) {
            tagInclude.where = tagFilters;
            tagInclude.required = true;
        }

        const order = buildOrderClause(sort);

        const limit = pagination.enabled ? pagination.pageSize : undefined;
        const offset = pagination.enabled ? pagination.skip : undefined;

        const { count, rows: assets } = await models.assets.findAndCountAll({
            where,
            include,
            order,
            limit,
            offset,
            distinct: true,
        });

        const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

        return {
            assets,
            pagination: {
                total: count,
                currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                totalPages,
                pageSize: pagination.enabled ? limit : count,
            },
        };
    };

    const getAssetsByCompliance = async (complianceId, filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
        const { where, joinKeys } = buildFilters(filters, searchFields);

        for (const key of Object.keys(sort)) {
            const { associationPath } = parseNestedField(key);
            if (associationPath.length > 0) joinKeys.add(associationPath[0]);
        }

        joinKeys.add("tenants");
        joinKeys.add("asset_compliance");

        const include = buildIncludes(joinKeys);

        const complianceInclude = include.find((i) => i.as === "asset_compliance");
        if (complianceInclude) {
            complianceInclude.where = { compliance_id: complianceId };
            complianceInclude.required = true;
        }

        const order = buildOrderClause(sort);

        const limit = pagination.enabled ? pagination.pageSize : undefined;
        const offset = pagination.enabled ? pagination.skip : undefined;

        const { count, rows: assets } = await models.assets.findAndCountAll({
            where,
            include,
            order,
            limit,
            offset,
            distinct: true,
        });

        const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

        return {
            assets,
            pagination: {
                total: count,
                currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                totalPages,
                pageSize: pagination.enabled ? limit : count,
            },
        };
    };

    const getAssetsByThreat = async (threatId, filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
        const { where, joinKeys } = buildFilters(filters, searchFields);

        for (const key of Object.keys(sort)) {
            const { associationPath } = parseNestedField(key);
            if (associationPath.length > 0) joinKeys.add(associationPath[0]);
        }

        joinKeys.add("tenants");
        joinKeys.add("asset_threats");

        const include = buildIncludes(joinKeys);

        const threatInclude = include.find((i) => i.as === "asset_threats");
        if (threatInclude) {
            threatInclude.where = { threat_id: threatId };
            threatInclude.required = true;
        }

        const order = buildOrderClause(sort);

        const limit = pagination.enabled ? pagination.pageSize : undefined;
        const offset = pagination.enabled ? pagination.skip : undefined;

        const { count, rows: assets } = await models.assets.findAndCountAll({
            where,
            include,
            order,
            limit,
            offset,
            distinct: true,
        });

        const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

        return {
            assets,
            pagination: {
                total: count,
                currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                totalPages,
                pageSize: pagination.enabled ? limit : count,
            },
        };
    };

    const getAssetsCount = async (filters = {}) => {
        const { where, joinKeys } = buildFilters(filters, {});
        const include = buildIncludes(joinKeys);

        return await models.assets.count({
            where,
            include: include.length > 0 ? include : undefined,
            distinct: true,
        });
    };

    const getAssetsStats = async (filters = {}) => {
        try {
            const total = await getAssetsCount(filters);
            const activeCount = await getAssetsCount({
                ...filters,
                lifecycle_state: "active",
            });
            const inactiveCount = await getAssetsCount({
                ...filters,
                lifecycle_state: "inactive",
            });
            const terminatedCount = await getAssetsCount({
                ...filters,
                lifecycle_state: "terminated",
            });
            const decommissionedCount = await getAssetsCount({
                ...filters,
                lifecycle_state: "decommissioned",
            });

            const healthyCount = await getAssetsCount({
                ...filters,
                health_status: "healthy",
            });
            const warningCount = await getAssetsCount({
                ...filters,
                health_status: "warning",
            });
            const criticalCount = await getAssetsCount({
                ...filters,
                health_status: "critical",
            });
            const unknownCount = await getAssetsCount({
                ...filters,
                health_status: "unknown",
            });

            const { where: statsWhere, joinKeys: statsJoinKeys } = buildFilters(filters, {});
            const statsInclude = buildIncludes(statsJoinKeys);

            const providerStats = await models.assets.findAll({
                attributes: ["provider", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
                where: statsWhere,
                include: statsInclude.length > 0 ? statsInclude : undefined,
                group: ["provider"],
                order: [[models.sequelize.col("count"), "DESC"]],
                distinct: true,
            });

            const environmentStats = await models.assets.findAll({
                attributes: ["environment", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
                where: statsWhere,
                include: statsInclude.length > 0 ? statsInclude : undefined,
                group: ["environment"],
                order: [[models.sequelize.col("count"), "DESC"]],
                distinct: true,
            });

            const regionStats = await models.assets.findAll({
                attributes: ["region", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
                where: statsWhere,
                include: statsInclude.length > 0 ? statsInclude : undefined,
                group: ["region"],
                order: [[models.sequelize.col("count"), "DESC"]],
                distinct: true,
            });

            const categoryStats = await models.assets.findAll({
                attributes: ["category", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
                where: statsWhere,
                include: statsInclude.length > 0 ? statsInclude : undefined,
                group: ["category"],
                order: [[models.sequelize.col("count"), "DESC"]],
                distinct: true,
            });

            return {
                total,
                lifecycle_state: {
                    active: activeCount,
                    inactive: inactiveCount,
                    terminated: terminatedCount,
                    decommissioned: decommissionedCount,
                },
                health_status: {
                    healthy: healthyCount,
                    warning: warningCount,
                    critical: criticalCount,
                    unknown: unknownCount,
                },
                providers: providerStats,
                environments: environmentStats,
                regions: regionStats,
                categories: categoryStats,
            };
        } catch (error) {
            console.info("Error fetching assets stats:", error);
            throw error;
        }
    };

    const bulkDeleteAssets = async (ids, userId = null) => {
        try {
            const assets = await models.assets.findAll({
                where: { id: { [Op.in]: ids } },
                attributes: ["id", "name", "tenant_id"],
            });

            const deletedRowsCount = await models.assets.destroy({
                where: { id: { [Op.in]: ids } },
            });

            if (userId) {
                for (const asset of assets) {
                    await auditService.createAuditLog({
                        tenant_id: asset.tenant_id,
                        user_id: userId,
                        action: "DELETE",
                        entity_type: "asset",
                        entity_id: asset.id,
                        description: `Asset deleted: ${asset.name}`,
                        severity: "info",
                        source: "user",
                    });
                }
            }

            return { message: `${deletedRowsCount} assets deleted successfully` };
        } catch (error) {
            console.info("Error bulk deleting assets:", error);
            throw error;
        }
    };

    const bulkCreateAssets = async (assetsData, userId = null) => {
        try {
            const assets = await models.assets.bulkCreate(assetsData);

            if (userId) {
                for (const asset of assets) {
                    await auditService.createAuditLog({
                        tenant_id: asset.tenant_id,
                        user_id: userId,
                        action: "CREATE",
                        entity_type: "asset",
                        entity_id: asset.id,
                        description: `Asset created: ${asset.name}`,
                        severity: "info",
                        source: "user",
                    });
                }
            }

            return assets;
        } catch (error) {
            console.info("Error bulk creating assets:", error);
            throw error;
        }
    };

    const addTagToAsset = async (assetId, tagKey, tagValue, userId = null) => {
        try {
            const asset = await models.assets.findByPk(assetId);
            if (!asset) {
                throw new Error("Asset not found");
            }

            const tag = await models.asset_tags.create({
                asset_id: assetId,
                tag_key: tagKey,
                tag_value: tagValue,
            });

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: asset.tenant_id,
                    user_id: userId,
                    action: "CREATE",
                    entity_type: "asset_tag",
                    entity_id: `${assetId}-${tagKey}`,
                    description: `Tag added to asset ${asset.name}: ${tagKey}=${tagValue}`,
                    severity: "info",
                    source: "user",
                });
            }

            return tag;
        } catch (error) {
            console.info("Error adding tag to asset:", error);
            throw error;
        }
    };

    const removeTagFromAsset = async (assetId, tagKey, userId = null) => {
        try {
            const asset = await models.assets.findByPk(assetId);
            if (!asset) {
                throw new Error("Asset not found");
            }

            const tag = await models.asset_tags.findOne({
                where: { asset_id: assetId, tag_key: tagKey },
            });

            if (!tag) {
                throw new Error("Tag not found on asset");
            }

            await models.asset_tags.destroy({
                where: { asset_id: assetId, tag_key: tagKey },
            });

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: asset.tenant_id,
                    user_id: userId,
                    action: "DELETE",
                    entity_type: "asset_tag",
                    entity_id: `${assetId}-${tagKey}`,
                    description: `Tag removed from asset ${asset.name}: ${tagKey}`,
                    severity: "info",
                    source: "user",
                });
            }

            return { message: "Tag removed from asset successfully" };
        } catch (error) {
            console.info("Error removing tag from asset:", error);
            throw error;
        }
    };

    const addComplianceToAsset = async (assetId, complianceId, userId = null) => {
        try {
            const asset = await models.assets.findByPk(assetId);
            if (!asset) {
                throw new Error("Asset not found");
            }

            const compliance = await models.compliance.findByPk(complianceId);
            if (!compliance) {
                throw new Error("Compliance not found");
            }

            const assetCompliance = await models.asset_compliance.create({
                asset_id: assetId,
                compliance_id: complianceId,
            });

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: asset.tenant_id,
                    user_id: userId,
                    action: "CREATE",
                    entity_type: "asset_compliance",
                    entity_id: `${assetId}-${complianceId}`,
                    description: `Compliance added to asset ${asset.name}: ${compliance.name}`,
                    severity: "info",
                    source: "user",
                });
            }

            return assetCompliance;
        } catch (error) {
            console.info("Error adding compliance to asset:", error);
            throw error;
        }
    };

    const removeComplianceFromAsset = async (assetId, complianceId, userId = null) => {
        try {
            const asset = await models.assets.findByPk(assetId);
            if (!asset) {
                throw new Error("Asset not found");
            }

            const compliance = await models.compliance.findByPk(complianceId);
            if (!compliance) {
                throw new Error("Compliance not found");
            }

            await models.asset_compliance.destroy({
                where: { asset_id: assetId, compliance_id: complianceId },
            });

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: asset.tenant_id,
                    user_id: userId,
                    action: "DELETE",
                    entity_type: "asset_compliance",
                    entity_id: `${assetId}-${complianceId}`,
                    description: `Compliance removed from asset ${asset.name}: ${compliance.name}`,
                    severity: "info",
                    source: "user",
                });
            }

            return { message: "Compliance removed from asset successfully" };
        } catch (error) {
            console.info("Error removing compliance from asset:", error);
            throw error;
        }
    };

    const addThreatToAsset = async (assetId, threatId, userId = null) => {
        try {
            const asset = await models.assets.findByPk(assetId);
            if (!asset) {
                throw new Error("Asset not found");
            }

            const threat = await models.threats.findByPk(threatId);
            if (!threat) {
                throw new Error("Threat not found");
            }

            const assetThreat = await models.asset_threats.create({
                asset_id: assetId,
                threat_id: threatId,
            });

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: asset.tenant_id,
                    user_id: userId,
                    action: "CREATE",
                    entity_type: "asset_threat",
                    entity_id: `${assetId}-${threatId}`,
                    description: `Threat added to asset ${asset.name}: ${threat.name}`,
                    severity: "info",
                    source: "user",
                });
            }

            return assetThreat;
        } catch (error) {
            console.info("Error adding threat to asset:", error);
            throw error;
        }
    };

    const removeThreatFromAsset = async (assetId, threatId, userId = null) => {
        try {
            const asset = await models.assets.findByPk(assetId);
            if (!asset) {
                throw new Error("Asset not found");
            }

            const threat = await models.threats.findByPk(threatId);
            if (!threat) {
                throw new Error("Threat not found");
            }

            await models.asset_threats.destroy({
                where: { asset_id: assetId, threat_id: threatId },
            });

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: asset.tenant_id,
                    user_id: userId,
                    action: "DELETE",
                    entity_type: "asset_threat",
                    entity_id: `${assetId}-${threatId}`,
                    description: `Threat removed from asset ${asset.name}: ${threat.name}`,
                    severity: "info",
                    source: "user",
                });
            }

            return { message: "Threat removed from asset successfully" };
        } catch (error) {
            console.info("Error removing threat from asset:", error);
            throw error;
        }
    };

    return {
        getAllAssets,
        getAssetById,
        createAsset,
        updateAsset,
        deleteAsset,
        getAssetsWithTag,
        getAssetsByCompliance,
        getAssetsByThreat,
        getAssetsCount,
        getAssetsStats,
        bulkDeleteAssets,
        bulkCreateAssets,
        addTagToAsset,
        removeTagFromAsset,
        addComplianceToAsset,
        removeComplianceFromAsset,
        addThreatToAsset,
        removeThreatFromAsset,
    };
};

export default assetServices;
