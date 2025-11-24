import { Op } from "sequelize";

import auditLogServices from "./auditLogServices.js";
import { models } from "../config/db.js";
import { ASSOCIATION_MAP } from "../associations/policiesAssociation.js";
import { serviceHelpers } from "../utils/service-helpers.js";

const { buildFilters, parseNestedField, buildIncludes, buildOrderClause } = serviceHelpers(ASSOCIATION_MAP);

const auditService = auditLogServices();

const policyServices = () => {
    const getAllPolicies = async (filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
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

            const { count, rows: policies } = await models.policies.findAndCountAll({
                where,
                include,
                order,
                limit,
                offset,
                distinct: true,
            });

            const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

            return {
                policies,
                pagination: {
                    total: count,
                    currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                    totalPages,
                    pageSize: pagination.enabled ? limit : count,
                },
            };
        } catch (error) {
            console.info("Error in getAllPolicies:", error);
            throw error;
        }
    };

    const getPolicyById = async (id) => {
        return await models.policies.findByPk(id, {
            include: [ASSOCIATION_MAP.policy_assets, ASSOCIATION_MAP.policy_compliance, ASSOCIATION_MAP.tenants],
        });
    };

    const createPolicy = async (policyData, userId = null) => {
        try {
            const policy = await models.policies.create(policyData);

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: policy.tenant_id,
                    user_id: userId,
                    action: "CREATE",
                    entity_type: "policy",
                    entity_id: policy.id,
                    description: `Policy created: ${policy.name}`,
                    severity: "info",
                    source: "system",
                });
            }

            return policy;
        } catch (error) {
            console.info("Error creating policy:", error);
            throw error;
        }
    };

    const updatePolicy = async (id, policyData, userId = null) => {
        try {
            const policy = await models.policies.findByPk(id);
            if (!policy) {
                throw new Error("Policy not found");
            }

            const oldPolicy = { ...policy.toJSON() };
            await models.policies.update(policyData, { where: { id } });
            const updatedPolicy = await models.policies.findByPk(id);

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: updatedPolicy.tenant_id,
                    user_id: userId,
                    action: "UPDATE",
                    entity_type: "policy",
                    entity_id: updatedPolicy.id,
                    description: `Policy updated: ${updatedPolicy.name}`,
                    before_state: JSON.stringify(oldPolicy),
                    after_state: JSON.stringify(updatedPolicy.toJSON()),
                    severity: "info",
                    source: "system",
                });
            }

            return updatedPolicy;
        } catch (error) {
            console.info("Error updating policy:", error);
            throw error;
        }
    };

    const deletePolicy = async (id, userId = null) => {
        try {
            const policy = await models.policies.findByPk(id);
            if (!policy) {
                throw new Error("Policy not found");
            }

            const deletedRowsCount = await models.policies.destroy({
                where: { id },
            });

            if (deletedRowsCount === 0) {
                throw new Error("Policy not found");
            }

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: policy.tenant_id,
                    user_id: userId,
                    action: "DELETE",
                    entity_type: "policy",
                    entity_id: policy.id,
                    description: `Policy deleted: ${policy.name}`,
                    severity: "info",
                    source: "system",
                });
            }

            return { message: "Policy deleted successfully" };
        } catch (error) {
            console.info("Error deleting policy:", error);
            throw error;
        }
    };

    const getPoliciesByTenant = async (tenantId, filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
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

        const { count, rows: policies } = await models.policies.findAndCountAll({
            where,
            include,
            order,
            limit,
            offset,
            distinct: true,
        });

        const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

        return {
            policies,
            pagination: {
                total: count,
                currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                totalPages,
                pageSize: pagination.enabled ? limit : count,
            },
        };
    };

    const getPoliciesByCategory = async (category, filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
        const { where, joinKeys } = buildFilters(filters, searchFields);

        for (const key of Object.keys(sort)) {
            const { associationPath } = parseNestedField(key);
            if (associationPath.length > 0) joinKeys.add(associationPath[0]);
        }

        where.category = category;

        const include = buildIncludes(joinKeys);

        const order = buildOrderClause(sort);

        const limit = pagination.enabled ? pagination.pageSize : undefined;
        const offset = pagination.enabled ? pagination.skip : undefined;

        const { count, rows: policies } = await models.policies.findAndCountAll({
            where,
            include,
            order,
            limit,
            offset,
            distinct: true,
        });

        const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

        return {
            policies,
            pagination: {
                total: count,
                currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                totalPages,
                pageSize: pagination.enabled ? limit : count,
            },
        };
    };

    const getPoliciesByValidationStatus = async (
        validationStatus,
        filters = {},
        pagination = {},
        searchFields = {},
        sort = { created_at: "DESC" }
    ) => {
        const { where, joinKeys } = buildFilters(filters, searchFields);

        for (const key of Object.keys(sort)) {
            const { associationPath } = parseNestedField(key);
            if (associationPath.length > 0) joinKeys.add(associationPath[0]);
        }

        where.validation_status = validationStatus;

        const include = buildIncludes(joinKeys);

        const order = buildOrderClause(sort);

        const limit = pagination.enabled ? pagination.pageSize : undefined;
        const offset = pagination.enabled ? pagination.skip : undefined;

        const { count, rows: policies } = await models.policies.findAndCountAll({
            where,
            include,
            order,
            limit,
            offset,
            distinct: true,
        });

        const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

        return {
            policies,
            pagination: {
                total: count,
                currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                totalPages,
                pageSize: pagination.enabled ? limit : count,
            },
        };
    };

    const getPolicyCount = async (filters = {}) => {
        const { where, joinKeys } = buildFilters(filters, {});
        const include = buildIncludes(joinKeys);

        return await models.policies.count({
            where,
            include: include.length > 0 ? include : undefined,
            distinct: true,
        });
    };

    const getPolicyStats = async (filters = {}) => {
        try {
            const total = await getPolicyCount(filters);
            const pendingCount = await getPolicyCount({
                ...filters,
                validation_status: "pending",
            });
            const validatedCount = await getPolicyCount({
                ...filters,
                validation_status: "validated",
            });
            const nonCompliantCount = await getPolicyCount({
                ...filters,
                compliance_status: "non_compliant",
            });
            const compliantCount = await getPolicyCount({
                ...filters,
                compliance_status: "compliant",
            });

            const { where: statsWhere, joinKeys: statsJoinKeys } = buildFilters(filters, {});
            const statsInclude = buildIncludes(statsJoinKeys);

            const policiesByCategory = await models.policies.findAll({
                attributes: ["category", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
                where: statsWhere,
                include: statsInclude,
                group: ["policies.category"],
                distinct: true,
            });

            const policiesByValidationStatus = await models.policies.findAll({
                attributes: ["validation_status", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
                where: statsWhere,
                include: statsInclude,
                group: ["policies.validation_status"],
                distinct: true,
            });

            const policiesByComplianceStatus = await models.policies.findAll({
                attributes: ["compliance_status", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
                where: statsWhere,
                include: statsInclude,
                group: ["policies.compliance_status"],
                distinct: true,
            });

            return {
                total,
                validation_status: {
                    pending: pendingCount,
                    validated: validatedCount,
                },
                compliance_status: {
                    compliant: compliantCount,
                    non_compliant: nonCompliantCount,
                },
                policies_by_category: policiesByCategory.map((p) => ({
                    category: p.category,
                    count: parseInt(p.count),
                })),
                policies_by_validation_status: policiesByValidationStatus.map((p) => ({
                    validation_status: p.validation_status,
                    count: parseInt(p.count),
                })),
                policies_by_compliance_status: policiesByComplianceStatus.map((p) => ({
                    compliance_status: p.compliance_status,
                    count: parseInt(p.count),
                })),
            };
        } catch (error) {
            console.info("Error fetching policy stats:", error);
            throw error;
        }
    };

    const getPolicyAssets = async (policyId) => {
        return await models.policy_assets.findAll({
            where: { policy_id: policyId },
            include: [ASSOCIATION_MAP.policy_assets.include[0]],
        });
    };

    const getPolicyCompliance = async (policyId) => {
        return await models.policy_compliance.findAll({
            where: { policy_id: policyId },
            include: [ASSOCIATION_MAP.policy_compliance.include[0]],
        });
    };

    const bulkDeletePolicies = async (ids, userId = null) => {
        try {
            const policies = await models.policies.findAll({
                where: { id: { [Op.in]: ids } },
                attributes: ["id", "name", "category", "tenant_id"],
            });

            const deletedRowsCount = await models.policies.destroy({
                where: { id: { [Op.in]: ids } },
            });

            if (userId) {
                for (const policy of policies) {
                    await auditService.createAuditLog({
                        tenant_id: policy.tenant_id,
                        user_id: userId,
                        action: "DELETE",
                        entity_type: "policy",
                        entity_id: policy.id,
                        description: `Policy deleted: ${policy.name}`,
                        severity: "info",
                        source: "system",
                    });
                }
            }

            return { message: `${deletedRowsCount} policies deleted successfully` };
        } catch (error) {
            console.info("Error bulk deleting policies:", error);
            throw error;
        }
    };

    const bulkCreatePolicies = async (policyData, userId = null) => {
        try {
            const policies = await models.policies.bulkCreate(policyData);

            if (userId) {
                for (const policy of policies) {
                    await auditService.createAuditLog({
                        tenant_id: policy.tenant_id,
                        user_id: userId,
                        action: "CREATE",
                        entity_type: "policy",
                        entity_id: policy.id,
                        description: `Policy created: ${policy.name}`,
                        severity: "info",
                        source: "system",
                    });
                }
            }

            return policies;
        } catch (error) {
            console.info("Error bulk creating policies:", error);
            throw error;
        }
    };

    return {
        getAllPolicies,
        getPolicyById,
        createPolicy,
        updatePolicy,
        deletePolicy,
        getPoliciesByTenant,
        getPoliciesByCategory,
        getPoliciesByValidationStatus,
        getPolicyCount,
        getPolicyStats,
        getPolicyAssets,
        getPolicyCompliance,
        bulkDeletePolicies,
        bulkCreatePolicies,
    };
};

export default policyServices;
