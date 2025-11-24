import { Op } from "sequelize";

import auditLogServices from "./auditLogServices.js";
import { models } from "../config/db.js";
import { ASSOCIATION_MAP } from "../associations/threatsAssociation.js";
import { serviceHelpers } from "../utils/service-helpers.js";

const { buildFilters, parseNestedField, buildIncludes, buildOrderClause } = serviceHelpers(ASSOCIATION_MAP);

const auditService = auditLogServices();

const threatServices = () => {
    const getAllThreats = async (filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
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

            const { count, rows: threats } = await models.threats.findAndCountAll({
                where,
                include,
                order,
                limit,
                offset,
                distinct: true,
            });

            const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

            return {
                threats,
                pagination: {
                    total: count,
                    currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                    totalPages,
                    pageSize: pagination.enabled ? limit : count,
                },
            };
        } catch (error) {
            console.info("Error in getAllThreats:", error);
            throw error;
        }
    };

    const getThreatById = async (id) => {
        return await models.threats.findByPk(id, {
            include: [
                ASSOCIATION_MAP.tenants,
                ASSOCIATION_MAP.asset_threats,
                ASSOCIATION_MAP.threat_remediation_steps,
                ASSOCIATION_MAP.threat_related_findings,
            ],
        });
    };

    const createThreat = async (threatData, userId = null) => {
        try {
            const threat = await models.threats.create(threatData);

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: threat.tenant_id,
                    user_id: userId,
                    action: "CREATE",
                    entity_type: "threat",
                    entity_id: threat.id,
                    description: `Threat created: ${threat.title || threat.name}`,
                    severity: "info",
                    source: "system",
                });
            }

            return threat;
        } catch (error) {
            console.info("Error creating threat:", error);
            throw error;
        }
    };

    const updateThreat = async (id, threatData, userId = null) => {
        try {
            const threat = await models.threats.findByPk(id);
            if (!threat) {
                throw new Error("Threat not found");
            }

            const oldThreat = { ...threat.toJSON() };
            await models.threats.update(threatData, { where: { id } });
            const updatedThreat = await models.threats.findByPk(id);

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: updatedThreat.tenant_id,
                    user_id: userId,
                    action: "UPDATE",
                    entity_type: "threat",
                    entity_id: updatedThreat.id,
                    description: `Threat updated: ${updatedThreat.title || updatedThreat.name}`,
                    before_state: JSON.stringify(oldThreat),
                    after_state: JSON.stringify(updatedThreat.toJSON()),
                    severity: "info",
                    source: "system",
                });
            }

            return updatedThreat;
        } catch (error) {
            console.info("Error updating threat:", error);
            throw error;
        }
    };

    const deleteThreat = async (id, userId = null) => {
        try {
            const threat = await models.threats.findByPk(id);
            if (!threat) {
                throw new Error("Threat not found");
            }

            const deletedRowsCount = await models.threats.destroy({
                where: { id },
            });

            if (deletedRowsCount === 0) {
                throw new Error("Threat not found");
            }

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: threat.tenant_id,
                    user_id: userId,
                    action: "DELETE",
                    entity_type: "threat",
                    entity_id: threat.id,
                    description: `Threat deleted: ${threat.title || threat.name}`,
                    severity: "info",
                    source: "system",
                });
            }

            return { message: "Threat deleted successfully" };
        } catch (error) {
            console.info("Error deleting threat:", error);
            throw error;
        }
    };

    const getThreatsByTenant = async (tenantId, filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
        const { where, joinKeys } = buildFilters(filters, searchFields);

        for (const key of Object.keys(sort)) {
            const { associationPath } = parseNestedField(key);
            if (associationPath.length > 0) joinKeys.add(associationPath[0]);
        }

        joinKeys.add("tenant");

        const include = buildIncludes(joinKeys);

        const tenantInclude = include.find((i) => i.as === "tenant");
        if (tenantInclude) {
            tenantInclude.where = { id: tenantId };
            tenantInclude.required = true;
        }

        const order = buildOrderClause(sort);

        const limit = pagination.enabled ? pagination.pageSize : undefined;
        const offset = pagination.enabled ? pagination.skip : undefined;

        const { count, rows: threats } = await models.threats.findAndCountAll({
            where,
            include,
            order,
            limit,
            offset,
            distinct: true,
        });

        const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

        return {
            threats,
            pagination: {
                total: count,
                currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                totalPages,
                pageSize: pagination.enabled ? limit : count,
            },
        };
    };

    const getThreatsByAsset = async (assetId, filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
        const { where, joinKeys } = buildFilters(filters, searchFields);

        for (const key of Object.keys(sort)) {
            const { associationPath } = parseNestedField(key);
            if (associationPath.length > 0) joinKeys.add(associationPath[0]);
        }

        joinKeys.add("asset_threats");

        const include = buildIncludes(joinKeys);

        const assetInclude = include.find((i) => i.as === "asset_threats");
        if (assetInclude) {
            assetInclude.where = { asset_id: assetId };
            assetInclude.required = true;
        }

        const order = buildOrderClause(sort);

        const limit = pagination.enabled ? pagination.pageSize : undefined;
        const offset = pagination.enabled ? pagination.skip : undefined;

        const { count, rows: threats } = await models.threats.findAndCountAll({
            where,
            include,
            order,
            limit,
            offset,
            distinct: true,
        });

        const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

        return {
            threats,
            pagination: {
                total: count,
                currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                totalPages,
                pageSize: pagination.enabled ? limit : count,
            },
        };
    };

    const getThreatCount = async (filters = {}) => {
        const { where, joinKeys } = buildFilters(filters, {});
        const include = buildIncludes(joinKeys);

        return await models.threats.count({
            where,
            include: include.length > 0 ? include : undefined,
            distinct: true,
        });
    };

    const getThreatStats = async (filters = {}) => {
        try {
            const total = await getThreatCount(filters);
            const activeCount = await getThreatCount({
                ...filters,
                status: "active",
            });
            const investigatingCount = await getThreatCount({
                ...filters,
                status: "investigating",
            });
            const resolvedCount = await getThreatCount({
                ...filters,
                status: "resolved",
            });
            const falsePositiveCount = await getThreatCount({
                ...filters,
                status: "false_positive",
            });

            const { where: statsWhere, joinKeys: statsJoinKeys } = buildFilters(filters, {});
            const statsInclude = buildIncludes(statsJoinKeys);

            const threatsBySeverity = await models.threats.findAll({
                attributes: ["severity", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
                where: statsWhere,
                include: statsInclude,
                group: ["severity"],
                distinct: true,
            });

            const threatsBySource = await models.threats.findAll({
                attributes: ["source", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
                where: statsWhere,
                include: statsInclude,
                group: ["source"],
                distinct: true,
            });

            const threatsByTenant = await models.threats.findAll({
                attributes: ["tenant_id", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
                where: statsWhere,
                include: [
                    {
                        ...ASSOCIATION_MAP.tenants,
                        attributes: [],
                        required: false,
                    },
                    ...statsInclude,
                ],
                group: ["threats.tenant_id", "tenant.name"],
                distinct: true,
            });

            return {
                total,
                status: {
                    active: activeCount,
                    investigating: investigatingCount,
                    resolved: resolvedCount,
                    false_positive: falsePositiveCount,
                },
                by_severity: threatsBySeverity.map((t) => ({
                    severity: t.severity,
                    count: parseInt(t.count),
                })),
                by_source: threatsBySource.map((t) => ({
                    source: t.source,
                    count: parseInt(t.count),
                })),
                by_tenant: threatsByTenant.map((t) => ({
                    tenant_id: t.tenant_id,
                    tenant_name: t.tenant?.name || "Unknown",
                    count: parseInt(t.count),
                })),
            };
        } catch (error) {
            console.info("Error fetching threat stats:", error);
            throw error;
        }
    };

    const bulkDeleteThreats = async (ids, userId = null) => {
        try {
            const threats = await models.threats.findAll({
                where: { id: { [Op.in]: ids } },
                attributes: ["id", "title", "name", "tenant_id"],
            });

            const deletedRowsCount = await models.threats.destroy({
                where: { id: { [Op.in]: ids } },
            });

            if (userId) {
                for (const threat of threats) {
                    await auditService.createAuditLog({
                        tenant_id: threat.tenant_id,
                        user_id: userId,
                        action: "DELETE",
                        entity_type: "threat",
                        entity_id: threat.id,
                        description: `Threat deleted: ${threat.title || threat.name}`,
                        severity: "info",
                        source: "system",
                    });
                }
            }

            return { message: `${deletedRowsCount} threats deleted successfully` };
        } catch (error) {
            console.info("Error bulk deleting threats:", error);
            throw error;
        }
    };

    const bulkCreateThreats = async (threatsData, userId = null) => {
        try {
            const threats = await models.threats.bulkCreate(threatsData);

            if (userId) {
                for (const threat of threats) {
                    await auditService.createAuditLog({
                        tenant_id: threat.tenant_id,
                        user_id: userId,
                        action: "CREATE",
                        entity_type: "threat",
                        entity_id: threat.id,
                        description: `Threat created: ${threat.title || threat.name}`,
                        severity: "info",
                        source: "system",
                    });
                }
            }

            return threats;
        } catch (error) {
            console.info("Error bulk creating threats:", error);
            throw error;
        }
    };

    return {
        getAllThreats,
        getThreatById,
        createThreat,
        updateThreat,
        deleteThreat,
        getThreatsByTenant,
        getThreatsByAsset,
        getThreatCount,
        getThreatStats,
        bulkDeleteThreats,
        bulkCreateThreats,
    };
};

export default threatServices;
