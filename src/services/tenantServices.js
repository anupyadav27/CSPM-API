import { Op } from "sequelize";

import auditLogServices from "./auditLogServices.js";
import { models } from "../config/db.js";
import { ASSOCIATION_MAP } from "../associations/tenantsAssociation.js";
import { serviceHelpers } from "../utils/service-helpers.js";

const { buildFilters, parseNestedField, buildIncludes, buildOrderClause } = serviceHelpers(ASSOCIATION_MAP);

const auditService = auditLogServices();

const tenantServices = () => {
    const getAllTenants = async (filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
        try {
            const { where, joinKeys } = buildFilters(filters, searchFields);

            for (const key of Object.keys(sort)) {
                const { associationPath } = parseNestedField(key);
                if (associationPath.length > 0) joinKeys.add(associationPath[0]);
            }

            const include = buildIncludes(joinKeys);
            const order = buildOrderClause(sort);

            const limit = pagination.enabled ? pagination.pageSize : undefined;
            const offset = pagination.enabled ? pagination.skip : undefined;

            const { count, rows: tenants } = await models.tenants.findAndCountAll({
                where,
                include,
                order,
                limit,
                offset,
                distinct: true,
            });

            const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

            return {
                tenants,
                pagination: {
                    total: count,
                    currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                    totalPages,
                    pageSize: pagination.enabled ? limit : count,
                },
            };
        } catch (error) {
            console.info("Error in getAllTenants:", error);
            throw error;
        }
    };

    const getAllTenantsByUser = async (userId, filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
        try {
            const { where, joinKeys } = buildFilters(filters, searchFields);

            for (const key of Object.keys(sort)) {
                const { associationPath } = parseNestedField(key);
                if (associationPath.length > 0) joinKeys.add(associationPath[0]);
            }

            joinKeys.add("tenant_users");

            const include = buildIncludes(joinKeys);

            const tenantUsersInclude = include.find((i) => i.as === "tenant_users");
            if (tenantUsersInclude) {
                tenantUsersInclude.where = { user_id: userId };
                tenantUsersInclude.required = true;

                if (tenantUsersInclude.include) {
                    tenantUsersInclude.include.push({
                        model: models.roles,
                        as: "role",
                        attributes: ["id", "name", "description"],
                        required: false,
                    });
                } else {
                    tenantUsersInclude.include = [
                        {
                            model: models.roles,
                            as: "role",
                            attributes: ["id", "name", "description"],
                            required: false,
                        },
                    ];
                }
            }

            const order = buildOrderClause(sort);

            const limit = pagination.enabled ? pagination.pageSize : undefined;
            const offset = pagination.enabled ? pagination.skip : undefined;

            const { count, rows: tenants } = await models.tenants.findAndCountAll({
                where,
                include,
                order,
                limit,
                offset,
                distinct: true,
            });

            const formattedTenants = tenants.map((tenant) => {
                const tenantData = tenant.toJSON();
                const userTenantEntry = tenantData.tenant_users?.find((tu) => tu.user_id === userId);
                delete tenantData.tenant_users;
                return {
                    ...tenantData,
                    role: {
                        id: userTenantEntry?.role_id || null,
                        name: userTenantEntry?.role?.name || null,
                        description: userTenantEntry?.role?.description || null,
                    },
                };
            });

            const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

            return {
                tenants: formattedTenants,
                pagination: {
                    total: count,
                    currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                    totalPages,
                    pageSize: pagination.enabled ? limit : count,
                },
            };
        } catch (error) {
            console.info("Error in getAllTenantsByUser:", error);
            throw error;
        }
    };

    const getTenantById = async (id) => {
        return await models.tenants.findByPk(id, {
            include: [
                ASSOCIATION_MAP.tenant_users,
                ASSOCIATION_MAP.assets,
                ASSOCIATION_MAP.policies,
                ASSOCIATION_MAP.compliance,
                ASSOCIATION_MAP.reports,
                ASSOCIATION_MAP.threats,
                ASSOCIATION_MAP.vulnerability_sources,
            ],
        });
    };

    const createTenant = async (tenantData, userId = null) => {
        try {
            const tenant = await models.tenants.create(tenantData);

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: tenant.id,
                    user_id: userId,
                    action: "CREATE",
                    entity_type: "tenant",
                    entity_id: tenant.id,
                    description: `Tenant created: ${tenant.name}`,
                    severity: "info",
                    source: "user",
                });
            }

            return tenant;
        } catch (error) {
            console.info("Error creating tenant:", error);
            throw error;
        }
    };

    const updateTenant = async (id, tenantData, userId = null) => {
        try {
            const tenant = await models.tenants.findByPk(id);
            if (!tenant) {
                throw new Error("Tenant not found");
            }

            const oldTenant = { ...tenant.toJSON() };
            await models.tenants.update(tenantData, { where: { id } });
            const updatedTenant = await models.tenants.findByPk(id);

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: updatedTenant.id,
                    user_id: userId,
                    action: "UPDATE",
                    entity_type: "tenant",
                    entity_id: updatedTenant.id,
                    description: `Tenant updated: ${updatedTenant.name}`,
                    before_state: JSON.stringify(oldTenant),
                    after_state: JSON.stringify(updatedTenant.toJSON()),
                    severity: "info",
                    source: "user",
                });
            }

            return updatedTenant;
        } catch (error) {
            console.info("Error updating tenant:", error);
            throw error;
        }
    };

    const deleteTenant = async (id, userId = null) => {
        try {
            const tenant = await models.tenants.findByPk(id);
            if (!tenant) {
                throw new Error("Tenant not found");
            }

            const deletedRowsCount = await models.tenants.destroy({
                where: { id },
            });

            if (deletedRowsCount === 0) {
                throw new Error("Tenant not found");
            }

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: tenant.id,
                    user_id: userId,
                    action: "DELETE",
                    entity_type: "tenant",
                    entity_id: tenant.id,
                    description: `Tenant deleted: ${tenant.name}`,
                    severity: "info",
                    source: "user",
                });
            }

            return { message: "Tenant deleted successfully" };
        } catch (error) {
            console.info("Error deleting tenant:", error);
            throw error;
        }
    };

    const getTenantsWithUser = async (userId, filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
        const { where, joinKeys } = buildFilters(filters, searchFields);

        for (const key of Object.keys(sort)) {
            const { associationPath } = parseNestedField(key);
            if (associationPath.length > 0) joinKeys.add(associationPath[0]);
        }

        joinKeys.add("tenant_users");

        const include = buildIncludes(joinKeys);

        const tenantUsersInclude = include.find((i) => i.as === "tenant_users");
        if (tenantUsersInclude) {
            tenantUsersInclude.where = { user_id: userId };
            tenantUsersInclude.required = true;
        }

        const order = buildOrderClause(sort);

        const limit = pagination.enabled ? pagination.pageSize : undefined;
        const offset = pagination.enabled ? pagination.skip : undefined;

        const { count, rows: tenants } = await models.tenants.findAndCountAll({
            where,
            include,
            order,
            limit,
            offset,
            distinct: true,
        });

        const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

        return {
            tenants,
            pagination: {
                total: count,
                currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                totalPages,
                pageSize: pagination.enabled ? limit : count,
            },
        };
    };

    const getTenantsWithAsset = async (assetId, filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
        const { where, joinKeys } = buildFilters(filters, searchFields);

        for (const key of Object.keys(sort)) {
            const { associationPath } = parseNestedField(key);
            if (associationPath.length > 0) joinKeys.add(associationPath[0]);
        }

        joinKeys.add("assets");

        const include = buildIncludes(joinKeys);

        const assetsInclude = include.find((i) => i.as === "assets");
        if (assetsInclude) {
            assetsInclude.where = { id: assetId };
            assetsInclude.required = true;
        }

        const order = buildOrderClause(sort);

        const limit = pagination.enabled ? pagination.pageSize : undefined;
        const offset = pagination.enabled ? pagination.skip : undefined;

        const { count, rows: tenants } = await models.tenants.findAndCountAll({
            where,
            include,
            order,
            limit,
            offset,
            distinct: true,
        });

        const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

        return {
            tenants,
            pagination: {
                total: count,
                currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                totalPages,
                pageSize: pagination.enabled ? limit : count,
            },
        };
    };

    const getTenantsWithPolicy = async (policyId, filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
        const { where, joinKeys } = buildFilters(filters, searchFields);

        for (const key of Object.keys(sort)) {
            const { associationPath } = parseNestedField(key);
            if (associationPath.length > 0) joinKeys.add(associationPath[0]);
        }

        joinKeys.add("policies");

        const include = buildIncludes(joinKeys);

        const policiesInclude = include.find((i) => i.as === "policies");
        if (policiesInclude) {
            policiesInclude.where = { id: policyId };
            policiesInclude.required = true;
        }

        const order = buildOrderClause(sort);

        const limit = pagination.enabled ? pagination.pageSize : undefined;
        const offset = pagination.enabled ? pagination.skip : undefined;

        const { count, rows: tenants } = await models.tenants.findAndCountAll({
            where,
            include,
            order,
            limit,
            offset,
            distinct: true,
        });

        const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

        return {
            tenants,
            pagination: {
                total: count,
                currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                totalPages,
                pageSize: pagination.enabled ? limit : count,
            },
        };
    };

    const getTenantsWithCompliance = async (complianceId, filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
        const { where, joinKeys } = buildFilters(filters, searchFields);

        for (const key of Object.keys(sort)) {
            const { associationPath } = parseNestedField(key);
            if (associationPath.length > 0) joinKeys.add(associationPath[0]);
        }

        joinKeys.add("compliances");

        const include = buildIncludes(joinKeys);

        const complianceInclude = include.find((i) => i.as === "compliances");
        if (complianceInclude) {
            complianceInclude.where = { id: complianceId };
            complianceInclude.required = true;
        }

        const order = buildOrderClause(sort);

        const limit = pagination.enabled ? pagination.pageSize : undefined;
        const offset = pagination.enabled ? pagination.skip : undefined;

        const { count, rows: tenants } = await models.tenants.findAndCountAll({
            where,
            include,
            order,
            limit,
            offset,
            distinct: true,
        });

        const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

        return {
            tenants,
            pagination: {
                total: count,
                currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                totalPages,
                pageSize: pagination.enabled ? limit : count,
            },
        };
    };

    const getTenantCount = async (filters = {}) => {
        const { where, joinKeys } = buildFilters(filters, {});
        const include = buildIncludes(joinKeys);

        return await models.tenants.count({
            where,
            include: include.length > 0 ? include : undefined,
            distinct: true,
        });
    };

    const getTenantStats = async (filters = {}) => {
        try {
            const total = await getTenantCount(filters);
            const activeCount = await getTenantCount({
                ...filters,
                status: "active",
            });
            const inactiveCount = await getTenantCount({
                ...filters,
                status: "inactive",
            });
            const suspendedCount = await getTenantCount({
                ...filters,
                status: "suspended",
            });

            const { where: statsWhere, joinKeys: statsJoinKeys } = buildFilters(filters, {});
            const statsInclude = buildIncludes(statsJoinKeys);

            const assetCountByTenant = await models.tenants.findAll({
                attributes: ["id", "name", [models.sequelize.fn("COUNT", models.sequelize.col("assets.id")), "asset_count"]],
                where: statsWhere,
                include: [
                    {
                        ...ASSOCIATION_MAP.assets,
                        attributes: [],
                        required: false,
                    },
                    ...statsInclude,
                ],
                group: ["tenants.id", "tenants.name"],
                distinct: true,
            });

            const userCountByTenant = await models.tenants.findAll({
                attributes: ["id", "name", [models.sequelize.fn("COUNT", models.sequelize.col("tenant_users.user_id")), "user_count"]],
                where: statsWhere,
                include: [
                    {
                        ...ASSOCIATION_MAP.tenant_users,
                        attributes: [],
                        required: false,
                    },
                    ...statsInclude,
                ],
                group: ["tenants.id", "tenants.name"],
                distinct: true,
            });

            const policyCountByTenant = await models.tenants.findAll({
                attributes: ["id", "name", [models.sequelize.fn("COUNT", models.sequelize.col("policies.id")), "policy_count"]],
                where: statsWhere,
                include: [
                    {
                        ...ASSOCIATION_MAP.policies,
                        attributes: [],
                        required: false,
                    },
                    ...statsInclude,
                ],
                group: ["tenants.id", "tenants.name"],
                distinct: true,
            });

            return {
                total,
                status: {
                    active: activeCount,
                    inactive: inactiveCount,
                    suspended: suspendedCount,
                },
                assets_by_tenant: assetCountByTenant.map((t) => ({
                    tenant_id: t.id,
                    tenant_name: t.name,
                    count: parseInt(t.asset_count),
                })),
                users_by_tenant: userCountByTenant.map((t) => ({
                    tenant_id: t.id,
                    tenant_name: t.name,
                    count: parseInt(t.user_count),
                })),
                policies_by_tenant: policyCountByTenant.map((t) => ({
                    tenant_id: t.id,
                    tenant_name: t.name,
                    count: parseInt(t.policy_count),
                })),
            };
        } catch (error) {
            console.info("Error fetching tenant stats:", error);
            throw error;
        }
    };

    const bulkDeleteTenants = async (ids, userId = null) => {
        try {
            const tenants = await models.tenants.findAll({
                where: { id: { [Op.in]: ids } },
                attributes: ["id", "name"],
            });

            const deletedRowsCount = await models.tenants.destroy({
                where: { id: { [Op.in]: ids } },
            });

            if (userId) {
                for (const tenant of tenants) {
                    await auditService.createAuditLog({
                        tenant_id: tenant.id,
                        user_id: userId,
                        action: "DELETE",
                        entity_type: "tenant",
                        entity_id: tenant.id,
                        description: `Tenant deleted: ${tenant.name}`,
                        severity: "info",
                        source: "user",
                    });
                }
            }

            return { message: `${deletedRowsCount} tenants deleted successfully` };
        } catch (error) {
            console.info("Error bulk deleting tenants:", error);
            throw error;
        }
    };

    const bulkCreateTenants = async (tenantsData, userId = null) => {
        try {
            const tenants = await models.tenants.bulkCreate(tenantsData);

            if (userId) {
                for (const tenant of tenants) {
                    await auditService.createAuditLog({
                        tenant_id: tenant.id,
                        user_id: userId,
                        action: "CREATE",
                        entity_type: "tenant",
                        entity_id: tenant.id,
                        description: `Tenant created: ${tenant.name}`,
                        severity: "info",
                        source: "user",
                    });
                }
            }

            return tenants;
        } catch (error) {
            console.info("Error bulk creating tenants:", error);
            throw error;
        }
    };

    const addUserToTenant = async (tenantId, userId, role, createdByUserId = null) => {
        try {
            const tenant = await models.tenants.findByPk(tenantId);
            if (!tenant) {
                throw new Error("Tenant not found");
            }

            const user = await models.users.findByPk(userId);
            if (!user) {
                throw new Error("User not found");
            }

            const tenantUser = await models.tenant_users.create({
                tenant_id: tenantId,
                user_id: userId,
                role_id: role,
            });

            if (createdByUserId) {
                await auditService.createAuditLog({
                    tenant_id: tenant.id,
                    user_id: createdByUserId,
                    action: "CREATE",
                    entity_type: "tenant_user",
                    entity_id: `${tenantId}-${userId}`,
                    description: `User added to tenant ${tenant.name}: ${user.username} with role ${role}`,
                    severity: "info",
                    source: "user",
                });
            }

            return tenantUser;
        } catch (error) {
            console.info("Error adding user to tenant:", error);
            throw error;
        }
    };

    const removeUserFromTenant = async (tenantId, userId, deletedByUserId = null) => {
        try {
            const tenant = await models.tenants.findByPk(tenantId);
            if (!tenant) {
                throw new Error("Tenant not found");
            }

            const user = await models.users.findByPk(userId);
            if (!user) {
                throw new Error("User not found");
            }

            const deletedRowsCount = await models.tenant_users.destroy({
                where: { tenant_id: tenantId, user_id: userId },
            });

            if (deletedRowsCount === 0) {
                throw new Error("User not found in tenant");
            }

            if (deletedByUserId) {
                await auditService.createAuditLog({
                    tenant_id: tenant.id,
                    user_id: deletedByUserId,
                    action: "DELETE",
                    entity_type: "tenant_user",
                    entity_id: `${tenantId}-${userId}`,
                    description: `User removed from tenant ${tenant.name}: ${user.username}`,
                    severity: "info",
                    source: "user",
                });
            }

            return { message: "User removed from tenant successfully" };
        } catch (error) {
            console.info("Error removing user from tenant:", error);
            throw error;
        }
    };

    const addAssetToTenant = async (assetId, newTenantId, movedByUserId = null) => {
        try {
            const asset = await models.assets.findByPk(assetId);
            if (!asset) {
                throw new Error("Asset not found");
            }

            const oldTenantId = asset.tenant_id;
            const newTenant = await models.tenants.findByPk(newTenantId);
            if (!newTenant) {
                throw new Error("New tenant not found");
            }

            await models.assets.update({ tenant_id: newTenantId }, { where: { id: assetId } });

            if (movedByUserId) {
                await auditService.createAuditLog({
                    tenant_id: oldTenantId,
                    user_id: movedByUserId,
                    action: "UPDATE",
                    entity_type: "asset",
                    entity_id: assetId,
                    description: `Asset moved from tenant ${oldTenantId} to tenant ${newTenantId}: ${asset.name}`,
                    before_state: JSON.stringify({ tenant_id: oldTenantId }),
                    after_state: JSON.stringify({ tenant_id: newTenantId }),
                    severity: "info",
                    source: "user",
                });
            }

            return await models.assets.findByPk(assetId);
        } catch (error) {
            console.info("Error moving asset to tenant:", error);
            throw error;
        }
    };

    const addPolicyToTenant = async (policyId, tenantId, assignedByUserId = null) => {
        try {
            const policy = await models.policies.findByPk(policyId);
            if (!policy) {
                throw new Error("Policy not found");
            }

            const tenant = await models.tenants.findByPk(tenantId);
            if (!tenant) {
                throw new Error("Tenant not found");
            }

            await models.policies.update({ tenant_id: tenantId }, { where: { id: policyId } });

            if (assignedByUserId) {
                await auditService.createAuditLog({
                    tenant_id: tenant.id,
                    user_id: assignedByUserId,
                    action: "UPDATE",
                    entity_type: "policy",
                    entity_id: policyId,
                    description: `Policy assigned to tenant ${tenant.name}: ${policy.name}`,
                    before_state: JSON.stringify({ tenant_id: null }),
                    after_state: JSON.stringify({ tenant_id: tenantId }),
                    severity: "info",
                    source: "user",
                });
            }

            return await models.policies.findByPk(policyId);
        } catch (error) {
            console.info("Error assigning policy to tenant:", error);
            throw error;
        }
    };

    const addComplianceToTenant = async (complianceId, tenantId, assignedByUserId = null) => {
        try {
            const compliance = await models.compliance.findByPk(complianceId);
            if (!compliance) {
                throw new Error("Compliance not found");
            }

            const tenant = await models.tenants.findByPk(tenantId);
            if (!tenant) {
                throw new Error("Tenant not found");
            }

            await models.compliance.update({ tenant_id: tenantId }, { where: { id: complianceId } });

            if (assignedByUserId) {
                await auditService.createAuditLog({
                    tenant_id: tenant.id,
                    user_id: assignedByUserId,
                    action: "UPDATE",
                    entity_type: "compliance",
                    entity_id: complianceId,
                    description: `Compliance assigned to tenant ${tenant.name}: ${compliance.name}`,
                    before_state: JSON.stringify({ tenant_id: null }),
                    after_state: JSON.stringify({ tenant_id: tenantId }),
                    severity: "info",
                    source: "user",
                });
            }

            return await models.compliance.findByPk(complianceId);
        } catch (error) {
            console.info("Error assigning compliance to tenant:", error);
            throw error;
        }
    };

    return {
        getAllTenants,
        getAllTenantsByUser,
        getTenantById,
        createTenant,
        updateTenant,
        deleteTenant,
        getTenantsWithUser,
        getTenantsWithAsset,
        getTenantsWithPolicy,
        getTenantsWithCompliance,
        getTenantCount,
        getTenantStats,
        bulkDeleteTenants,
        bulkCreateTenants,
        addUserToTenant,
        removeUserFromTenant,
        addAssetToTenant,
        addPolicyToTenant,
        addComplianceToTenant,
    };
};

export default tenantServices;
