import { Op } from "sequelize";

import auditLogServices from "./auditLogServices.js";
import { models } from "../config/db.js";
import { ASSOCIATION_MAP } from "../associations/complianceAssociation.js";
import { serviceHelpers } from "../utils/service-helpers.js";

const { buildFilters, parseNestedField, buildIncludes, buildOrderClause } = serviceHelpers(ASSOCIATION_MAP);

const auditService = auditLogServices();

const complianceServices = () => {
    const getAllCompliance = async (filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
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

            const { count, rows: complianceItems } = await models.compliance.findAndCountAll({
                where,
                include,
                order,
                limit,
                offset,
                distinct: true,
            });

            const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

            return {
                complianceItems,
                pagination: {
                    total: count,
                    currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                    totalPages,
                    pageSize: pagination.enabled ? limit : count,
                },
            };
        } catch (error) {
            console.info("Error in getAllCompliance:", error);
            throw error;
        }
    };

    const getComplianceById = async (id) => {
        return await models.compliance.findByPk(id, {
            include: [ASSOCIATION_MAP.asset_compliance, ASSOCIATION_MAP.policy_compliance, ASSOCIATION_MAP.tenants],
        });
    };

    const createCompliance = async (complianceData, userId = null) => {
        try {
            const compliance = await models.compliance.create(complianceData);

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: compliance.tenant_id,
                    user_id: userId,
                    action: "CREATE",
                    entity_type: "compliance",
                    entity_id: compliance.id,
                    description: `Compliance item created: ${compliance.framework} - ${compliance.control_id}`,
                    severity: "info",
                    source: "system",
                });
            }

            return compliance;
        } catch (error) {
            console.info("Error creating compliance:", error);
            throw error;
        }
    };

    const updateCompliance = async (id, complianceData, userId = null) => {
        try {
            const compliance = await models.compliance.findByPk(id);
            if (!compliance) {
                throw new Error("Compliance item not found");
            }

            const oldCompliance = { ...compliance.toJSON() };
            await models.compliance.update(complianceData, { where: { id } });
            const updatedCompliance = await models.compliance.findByPk(id);

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: updatedCompliance.tenant_id,
                    user_id: userId,
                    action: "UPDATE",
                    entity_type: "compliance",
                    entity_id: updatedCompliance.id,
                    description: `Compliance item updated: ${updatedCompliance.framework} - ${updatedCompliance.control_id}`,
                    before_state: JSON.stringify(oldCompliance),
                    after_state: JSON.stringify(updatedCompliance.toJSON()),
                    severity: "info",
                    source: "system",
                });
            }

            return updatedCompliance;
        } catch (error) {
            console.info("Error updating compliance:", error);
            throw error;
        }
    };

    const deleteCompliance = async (id, userId = null) => {
        try {
            const compliance = await models.compliance.findByPk(id);
            if (!compliance) {
                throw new Error("Compliance item not found");
            }

            const deletedRowsCount = await models.compliance.destroy({
                where: { id },
            });

            if (deletedRowsCount === 0) {
                throw new Error("Compliance item not found");
            }

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: compliance.tenant_id,
                    user_id: userId,
                    action: "DELETE",
                    entity_type: "compliance",
                    entity_id: compliance.id,
                    description: `Compliance item deleted: ${compliance.framework} - ${compliance.control_id}`,
                    severity: "info",
                    source: "system",
                });
            }

            return { message: "Compliance item deleted successfully" };
        } catch (error) {
            console.info("Error deleting compliance:", error);
            throw error;
        }
    };

    const getComplianceByTenant = async (tenantId, filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
        const { where, joinKeys } = buildFilters(filters, searchFields);

        for (const key of Object.keys(sort)) {
            const { associationPath } = parseNestedField(key);
            if (associationPath.length > 0) joinKeys.add(associationPath[0]);
        }

        joinKeys.add("tenants");

        const include = buildIncludes(joinKeys);

        const tenantInclude = include.find((i) => i.as === "tenants");
        if (tenantInclude) {
            tenantInclude.where = { id: tenantId };
            tenantInclude.required = true;
        }

        const order = buildOrderClause(sort);

        const limit = pagination.enabled ? pagination.pageSize : undefined;
        const offset = pagination.enabled ? pagination.skip : undefined;

        const { count, rows: complianceItems } = await models.compliance.findAndCountAll({
            where,
            include,
            order,
            limit,
            offset,
            distinct: true,
        });

        const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

        return {
            complianceItems,
            pagination: {
                total: count,
                currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                totalPages,
                pageSize: pagination.enabled ? limit : count,
            },
        };
    };

    const getComplianceByFramework = async (framework, filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
        const { where, joinKeys } = buildFilters(filters, searchFields);

        for (const key of Object.keys(sort)) {
            const { associationPath } = parseNestedField(key);
            if (associationPath.length > 0) joinKeys.add(associationPath[0]);
        }

        where.framework = framework;

        const include = buildIncludes(joinKeys);

        const order = buildOrderClause(sort);

        const limit = pagination.enabled ? pagination.pageSize : undefined;
        const offset = pagination.enabled ? pagination.skip : undefined;

        const { count, rows: complianceItems } = await models.compliance.findAndCountAll({
            where,
            include,
            order,
            limit,
            offset,
            distinct: true,
        });

        const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

        return {
            complianceItems,
            pagination: {
                total: count,
                currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                totalPages,
                pageSize: pagination.enabled ? limit : count,
            },
        };
    };

    const getComplianceCount = async (filters = {}) => {
        const { where, joinKeys } = buildFilters(filters, {});
        const include = buildIncludes(joinKeys);

        return await models.compliance.count({
            where,
            include: include.length > 0 ? include : undefined,
            distinct: true,
        });
    };

    const getComplianceStats = async (filters = {}) => {
        try {
            const total = await getComplianceCount(filters);
            const pendingCount = await getComplianceCount({
                ...filters,
                status: "pending",
            });
            const compliantCount = await getComplianceCount({
                ...filters,
                status: "compliant",
            });
            const nonCompliantCount = await getComplianceCount({
                ...filters,
                status: "non_compliant",
            });

            const { where: statsWhere, joinKeys: statsJoinKeys } = buildFilters(filters, {});
            const statsInclude = buildIncludes(statsJoinKeys);

            const complianceByFramework = await models.compliance.findAll({
                attributes: ["framework", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
                where: statsWhere,
                include: statsInclude,
                group: ["compliance.framework"],
                distinct: true,
            });

            const complianceByStatus = await models.compliance.findAll({
                attributes: ["status", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
                where: statsWhere,
                include: statsInclude,
                group: ["compliance.status"],
                distinct: true,
            });

            const complianceBySeverity = await models.compliance.findAll({
                attributes: ["severity", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
                where: statsWhere,
                include: statsInclude,
                group: ["compliance.severity"],
                distinct: true,
            });

            return {
                total,
                status: {
                    pending: pendingCount,
                    compliant: compliantCount,
                    non_compliant: nonCompliantCount,
                },
                compliance_by_framework: complianceByFramework.map((c) => ({
                    framework: c.framework,
                    count: parseInt(c.count),
                })),
                compliance_by_status: complianceByStatus.map((c) => ({
                    status: c.status,
                    count: parseInt(c.count),
                })),
                compliance_by_severity: complianceBySeverity.map((c) => ({
                    severity: c.severity,
                    count: parseInt(c.count),
                })),
            };
        } catch (error) {
            console.info("Error fetching compliance stats:", error);
            throw error;
        }
    };

    const getComplianceRemediationSteps = async (complianceId) => {
        return await models.compliance_remediation_steps.findAll({
            where: { compliance_id: complianceId },
            order: [["step_order", "ASC"]],
        });
    };

    const bulkDeleteCompliance = async (ids, userId = null) => {
        try {
            const complianceItems = await models.compliance.findAll({
                where: { id: { [Op.in]: ids } },
                attributes: ["id", "framework", "control_id", "tenant_id"],
            });

            const deletedRowsCount = await models.compliance.destroy({
                where: { id: { [Op.in]: ids } },
            });

            if (userId) {
                for (const compliance of complianceItems) {
                    await auditService.createAuditLog({
                        tenant_id: compliance.tenant_id,
                        user_id: userId,
                        action: "DELETE",
                        entity_type: "compliance",
                        entity_id: compliance.id,
                        description: `Compliance item deleted: ${compliance.framework} - ${compliance.control_id}`,
                        severity: "info",
                        source: "system",
                    });
                }
            }

            return { message: `${deletedRowsCount} compliance items deleted successfully` };
        } catch (error) {
            console.info("Error bulk deleting compliance:", error);
            throw error;
        }
    };

    const bulkCreateCompliance = async (complianceData, userId = null) => {
        try {
            const complianceItems = await models.compliance.bulkCreate(complianceData);

            if (userId) {
                for (const compliance of complianceItems) {
                    await auditService.createAuditLog({
                        tenant_id: compliance.tenant_id,
                        user_id: userId,
                        action: "CREATE",
                        entity_type: "compliance",
                        entity_id: compliance.id,
                        description: `Compliance item created: ${compliance.framework} - ${compliance.control_id}`,
                        severity: "info",
                        source: "system",
                    });
                }
            }

            return complianceItems;
        } catch (error) {
            console.info("Error bulk creating compliance:", error);
            throw error;
        }
    };

    return {
        getAllCompliance,
        getComplianceById,
        createCompliance,
        updateCompliance,
        deleteCompliance,
        getComplianceByTenant,
        getComplianceByFramework,
        getComplianceCount,
        getComplianceStats,
        getComplianceRemediationSteps,
        bulkDeleteCompliance,
        bulkCreateCompliance,
    };
};

export default complianceServices;
