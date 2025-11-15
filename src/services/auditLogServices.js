import { Op } from "sequelize";

import { models } from "../config/db.js";

const auditLogServices = () => {
    const getAllAuditLogs = async (filters = {}, pagination = {}, searchFields = {}, sort = { log_timestamp: -1 }) => {
        try {
            const queryOptions = {
                where: { ...filters },
                include: [
                    {
                        model: models.tenants,
                        as: "tenant",
                        attributes: ["id", "name"],
                        required: false,
                    },
                    {
                        model: models.users,
                        as: "user",
                        attributes: ["id", "email", "name"],
                        required: false,
                    },
                ],
                order: [],
                limit: pagination.enabled ? pagination.pageSize : undefined,
                offset: pagination.enabled ? pagination.skip : undefined,
            };

            const sortFields = [];
            for (const [field, direction] of Object.entries(sort)) {
                sortFields.push([field, direction === 1 ? "ASC" : "DESC"]);
            }
            queryOptions.order = sortFields;

            const searchConditions = [];
            for (const [key, value] of Object.entries(searchFields)) {
                if (value && value.trim() !== "") {
                    const fieldPath = key.replace("_search", "");
                    if (fieldPath.includes(".")) {
                        const [relation, field] = fieldPath.split(".");
                        searchConditions.push({
                            [`$${relation}.${field}$`]: {
                                [Op.iLike]: `%${value.trim()}%`,
                            },
                        });
                    } else {
                        searchConditions.push({
                            [fieldPath]: {
                                [Op.iLike]: `%${value.trim()}%`,
                            },
                        });
                    }
                }
            }

            if (searchConditions.length > 0) {
                queryOptions.where[Op.and] = searchConditions;
            }

            const { count, rows: auditLogs } = await models.audit_logs.findAndCountAll(queryOptions);

            const total = count;
            const totalPages = pagination.enabled ? Math.ceil(total / pagination.pageSize) : 1;
            const currentPage = pagination.enabled ? Math.floor(pagination.skip / pagination.pageSize) + 1 : 1;

            return {
                auditLogs,
                pagination: {
                    total,
                    pageSize: pagination.enabled ? pagination.pageSize : total,
                    currentPage,
                    totalPages,
                },
            };
        } catch (error) {
            console.info("Error fetching audit logs:", error);
            throw error;
        }
    };

    const getAuditLogById = async (id) => {
        try {
            const auditLog = await models.audit_logs.findByPk(id, {
                include: [
                    {
                        model: models.tenants,
                        as: "tenant",
                        attributes: ["id", "name"],
                        required: false,
                    },
                    {
                        model: models.users,
                        as: "user",
                        attributes: ["id", "email", "name"],
                        required: false,
                    },
                ],
            });

            return auditLog;
        } catch (error) {
            console.info("Error fetching audit log by id:", error);
            throw error;
        }
    };

    const createAuditLog = async (auditLogData) => {
        try {
            const auditLog = await models.audit_logs.create(auditLogData);
            return auditLog;
        } catch (error) {
            console.info("Error creating audit log:", error);
            throw error;
        }
    };

    const updateAuditLog = async (id, auditLogData) => {
        try {
            const [updatedRowsCount] = await models.audit_logs.update(auditLogData, {
                where: { id },
            });

            if (updatedRowsCount === 0) {
                throw new Error("Audit log not found");
            }

            const updatedAuditLog = await models.audit_logs.findByPk(id);
            return updatedAuditLog;
        } catch (error) {
            console.info("Error updating audit log:", error);
            throw error;
        }
    };

    const deleteAuditLog = async (id) => {
        try {
            const deletedRowsCount = await models.audit_logs.destroy({
                where: { id },
            });

            if (deletedRowsCount === 0) {
                throw new Error("Audit log not found");
            }

            return { message: "Audit log deleted successfully" };
        } catch (error) {
            console.info("Error deleting audit log:", error);
            throw error;
        }
    };

    const getAuditLogsByTenant = async (tenantId, filters = {}, pagination = {}, searchFields = {}, sort = { log_timestamp: -1 }) => {
        try {
            const finalFilters = {
                ...filters,
                tenant_id: tenantId,
            };

            return await getAllAuditLogs(finalFilters, pagination, searchFields, sort);
        } catch (error) {
            console.info("Error fetching audit logs by tenant:", error);
            throw error;
        }
    };

    const getAuditLogsByUser = async (userId, filters = {}, pagination = {}, searchFields = {}, sort = { log_timestamp: -1 }) => {
        try {
            const finalFilters = {
                ...filters,
                user_id: userId,
            };

            return await getAllAuditLogs(finalFilters, pagination, searchFields, sort);
        } catch (error) {
            console.info("Error fetching audit logs by user:", error);
            throw error;
        }
    };

    const getAuditLogsByAction = async (action, filters = {}, pagination = {}, searchFields = {}, sort = { log_timestamp: -1 }) => {
        try {
            const finalFilters = {
                ...filters,
                action,
            };

            return await getAllAuditLogs(finalFilters, pagination, searchFields, sort);
        } catch (error) {
            console.info("Error fetching audit logs by action:", error);
            throw error;
        }
    };

    const getAuditLogsByEntity = async (entity_type, entity_id, filters = {}, pagination = {}, searchFields = {}, sort = { log_timestamp: -1 }) => {
        try {
            const finalFilters = {
                ...filters,
                entity_type,
                entity_id,
            };

            return await getAllAuditLogs(finalFilters, pagination, searchFields, sort);
        } catch (error) {
            console.info("Error fetching audit logs by entity:", error);
            throw error;
        }
    };

    const getAuditLogsBySeverity = async (severity, filters = {}, pagination = {}, searchFields = {}, sort = { log_timestamp: -1 }) => {
        try {
            const finalFilters = {
                ...filters,
                severity,
            };

            return await getAllAuditLogs(finalFilters, pagination, searchFields, sort);
        } catch (error) {
            console.info("Error fetching audit logs by severity:", error);
            throw error;
        }
    };

    const getAuditLogsBySource = async (source, filters = {}, pagination = {}, searchFields = {}, sort = { log_timestamp: -1 }) => {
        try {
            const finalFilters = {
                ...filters,
                source,
            };

            return await getAllAuditLogs(finalFilters, pagination, searchFields, sort);
        } catch (error) {
            console.info("Error fetching audit logs by source:", error);
            throw error;
        }
    };

    const getAuditLogsByDateRange = async (startDate, endDate, filters = {}, pagination = {}, searchFields = {}, sort = { log_timestamp: -1 }) => {
        try {
            const dateFilter = {
                log_timestamp: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate,
                },
            };

            const finalFilters = {
                ...filters,
                ...dateFilter,
            };

            return await getAllAuditLogs(finalFilters, pagination, searchFields, sort);
        } catch (error) {
            console.info("Error fetching audit logs by date range:", error);
            throw error;
        }
    };

    const getAuditLogsByMethod = async (method, filters = {}, pagination = {}, searchFields = {}, sort = { log_timestamp: -1 }) => {
        try {
            const finalFilters = {
                ...filters,
                method,
            };

            return await getAllAuditLogs(finalFilters, pagination, searchFields, sort);
        } catch (error) {
            console.info("Error fetching audit logs by method:", error);
            throw error;
        }
    };

    const getAuditLogsByEndpoint = async (endpoint, filters = {}, pagination = {}, searchFields = {}, sort = { log_timestamp: -1 }) => {
        try {
            const finalFilters = {
                ...filters,
                endpoint,
            };

            return await getAllAuditLogs(finalFilters, pagination, searchFields, sort);
        } catch (error) {
            console.info("Error fetching audit logs by endpoint:", error);
            throw error;
        }
    };

    const getAuditLogsCount = async (filters = {}) => {
        try {
            const count = await models.audit_logs.count({ where: filters });
            return count;
        } catch (error) {
            console.info("Error fetching audit logs count:", error);
            throw error;
        }
    };

    const getAuditLogsStats = async (filters = {}) => {
        try {
            const total = await getAuditLogsCount(filters);
            const criticalCount = await getAuditLogsCount({
                ...filters,
                severity: "critical",
            });
            const errorCount = await getAuditLogsCount({
                ...filters,
                severity: "error",
            });
            const warningCount = await getAuditLogsCount({
                ...filters,
                severity: "warning",
            });
            const infoCount = await getAuditLogsCount({
                ...filters,
                severity: "info",
            });

            const userActions = await models.audit_logs.findAll({
                attributes: ["action", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
                where: filters,
                group: ["action"],
                order: [[models.sequelize.col("count"), "DESC"]],
                limit: 10,
            });

            const userActivity = await models.audit_logs.findAll({
                attributes: ["user_id", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
                where: filters,
                group: ["user_id"],
                order: [[models.sequelize.col("count"), "DESC"]],
                limit: 10,
            });

            return {
                total,
                severity: {
                    critical: criticalCount,
                    error: errorCount,
                    warning: warningCount,
                    info: infoCount,
                },
                topActions: userActions,
                topUsers: userActivity,
            };
        } catch (error) {
            console.info("Error fetching audit logs stats:", error);
            throw error;
        }
    };

    const bulkDeleteAuditLogs = async (ids) => {
        try {
            const deletedRowsCount = await models.audit_logs.destroy({
                where: { id: { [Op.in]: ids } },
            });

            return { message: `${deletedRowsCount} audit logs deleted successfully` };
        } catch (error) {
            console.info("Error bulk deleting audit logs:", error);
            throw error;
        }
    };

    const bulkCreateAuditLogs = async (auditLogsData) => {
        try {
            const auditLogs = await models.audit_logs.bulkCreate(auditLogsData);
            return auditLogs;
        } catch (error) {
            console.info("Error bulk creating audit logs:", error);
            throw error;
        }
    };

    return {
        getAllAuditLogs,
        getAuditLogById,
        createAuditLog,
        updateAuditLog,
        deleteAuditLog,
        getAuditLogsByTenant,
        getAuditLogsByUser,
        getAuditLogsByAction,
        getAuditLogsByEntity,
        getAuditLogsBySeverity,
        getAuditLogsBySource,
        getAuditLogsByDateRange,
        getAuditLogsByMethod,
        getAuditLogsByEndpoint,
        getAuditLogsCount,
        getAuditLogsStats,
        bulkDeleteAuditLogs,
        bulkCreateAuditLogs,
    };
};

export default auditLogServices;
