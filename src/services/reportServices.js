import { Op } from "sequelize";

import auditLogServices from "./auditLogServices.js";
import { models } from "../config/db.js";
import { ASSOCIATION_MAP } from "../associations/reportsAssociation.js";
import { serviceHelpers } from "../utils/service-helpers.js";

const { buildFilters, parseNestedField, buildIncludes, buildOrderClause } = serviceHelpers(ASSOCIATION_MAP);

const auditService = auditLogServices();

const reportServices = () => {
    const getAllReports = async (filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
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

            const { count, rows: reports } = await models.reports.findAndCountAll({
                where,
                include,
                order,
                limit,
                offset,
                distinct: true,
            });

            const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

            return {
                reports,
                pagination: {
                    total: count,
                    currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                    totalPages,
                    pageSize: pagination.enabled ? limit : count,
                },
            };
        } catch (error) {
            console.info("Error in getAllReports:", error);
            throw error;
        }
    };

    const getReportById = async (id) => {
        return await models.reports.findByPk(id, {
            include: [ASSOCIATION_MAP.report_assets, ASSOCIATION_MAP.report_compliance, ASSOCIATION_MAP.report_policies, ASSOCIATION_MAP.tenants],
        });
    };

    const createReport = async (reportData, userId = null) => {
        try {
            const report = await models.reports.create(reportData);

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: report.tenant_id,
                    user_id: userId,
                    action: "CREATE",
                    entity_type: "report",
                    entity_id: report.id,
                    description: `Report created: ${report.title}`,
                    severity: "info",
                    source: "system",
                });
            }

            return report;
        } catch (error) {
            console.info("Error creating report:", error);
            throw error;
        }
    };

    const updateReport = async (id, reportData, userId = null) => {
        try {
            const report = await models.reports.findByPk(id);
            if (!report) {
                throw new Error("Report not found");
            }

            const oldReport = { ...report.toJSON() };
            await models.reports.update(reportData, { where: { id } });
            const updatedReport = await models.reports.findByPk(id);

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: updatedReport.tenant_id,
                    user_id: userId,
                    action: "UPDATE",
                    entity_type: "report",
                    entity_id: updatedReport.id,
                    description: `Report updated: ${updatedReport.title}`,
                    before_state: JSON.stringify(oldReport),
                    after_state: JSON.stringify(updatedReport.toJSON()),
                    severity: "info",
                    source: "system",
                });
            }

            return updatedReport;
        } catch (error) {
            console.info("Error updating report:", error);
            throw error;
        }
    };

    const deleteReport = async (id, userId = null) => {
        try {
            const report = await models.reports.findByPk(id);
            if (!report) {
                throw new Error("Report not found");
            }

            const deletedRowsCount = await models.reports.destroy({
                where: { id },
            });

            if (deletedRowsCount === 0) {
                throw new Error("Report not found");
            }

            if (userId) {
                await auditService.createAuditLog({
                    tenant_id: report.tenant_id,
                    user_id: userId,
                    action: "DELETE",
                    entity_type: "report",
                    entity_id: report.id,
                    description: `Report deleted: ${report.title}`,
                    severity: "info",
                    source: "system",
                });
            }

            return { message: "Report deleted successfully" };
        } catch (error) {
            console.info("Error deleting report:", error);
            throw error;
        }
    };

    const getReportsByTenant = async (tenantId, filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
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

        const { count, rows: reports } = await models.reports.findAndCountAll({
            where,
            include,
            order,
            limit,
            offset,
            distinct: true,
        });

        const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

        return {
            reports,
            pagination: {
                total: count,
                currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                totalPages,
                pageSize: pagination.enabled ? limit : count,
            },
        };
    };

    const getReportsByType = async (type, filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
        const { where, joinKeys } = buildFilters(filters, searchFields);

        for (const key of Object.keys(sort)) {
            const { associationPath } = parseNestedField(key);
            if (associationPath.length > 0) joinKeys.add(associationPath[0]);
        }

        where.type = type;

        const include = buildIncludes(joinKeys);

        const order = buildOrderClause(sort);

        const limit = pagination.enabled ? pagination.pageSize : undefined;
        const offset = pagination.enabled ? pagination.skip : undefined;

        const { count, rows: reports } = await models.reports.findAndCountAll({
            where,
            include,
            order,
            limit,
            offset,
            distinct: true,
        });

        const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

        return {
            reports,
            pagination: {
                total: count,
                currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                totalPages,
                pageSize: pagination.enabled ? limit : count,
            },
        };
    };

    const getReportsByStatus = async (status, filters = {}, pagination = {}, searchFields = {}, sort = { created_at: "DESC" }) => {
        const { where, joinKeys } = buildFilters(filters, searchFields);

        for (const key of Object.keys(sort)) {
            const { associationPath } = parseNestedField(key);
            if (associationPath.length > 0) joinKeys.add(associationPath[0]);
        }

        where.status = status;

        const include = buildIncludes(joinKeys);

        const order = buildOrderClause(sort);

        const limit = pagination.enabled ? pagination.pageSize : undefined;
        const offset = pagination.enabled ? pagination.skip : undefined;

        const { count, rows: reports } = await models.reports.findAndCountAll({
            where,
            include,
            order,
            limit,
            offset,
            distinct: true,
        });

        const totalPages = pagination.enabled ? Math.ceil(count / pagination.pageSize) : 1;

        return {
            reports,
            pagination: {
                total: count,
                currentPage: pagination.enabled ? Math.floor(offset / limit) + 1 : 1,
                totalPages,
                pageSize: pagination.enabled ? limit : count,
            },
        };
    };

    const getReportCount = async (filters = {}) => {
        const { where, joinKeys } = buildFilters(filters, {});
        const include = buildIncludes(joinKeys);

        return await models.reports.count({
            where,
            include: include.length > 0 ? include : undefined,
            distinct: true,
        });
    };

    const getReportStats = async (filters = {}) => {
        try {
            const total = await getReportCount(filters);
            const pendingCount = await getReportCount({
                ...filters,
                status: "pending",
            });
            const completedCount = await getReportCount({
                ...filters,
                status: "completed",
            });
            const failedCount = await getReportCount({
                ...filters,
                status: "failed",
            });

            const { where: statsWhere, joinKeys: statsJoinKeys } = buildFilters(filters, {});
            const statsInclude = buildIncludes(statsJoinKeys);

            const reportsByType = await models.reports.findAll({
                attributes: ["type", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
                where: statsWhere,
                include: statsInclude,
                group: ["reports.type"],
                distinct: true,
            });

            const reportsByStatus = await models.reports.findAll({
                attributes: ["status", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
                where: statsWhere,
                include: statsInclude,
                group: ["reports.status"],
                distinct: true,
            });

            const reportsByTenant = await models.reports.findAll({
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
                group: ["reports.tenant_id"],
                distinct: true,
            });

            return {
                total,
                status: {
                    pending: pendingCount,
                    completed: completedCount,
                    failed: failedCount,
                },
                reports_by_type: reportsByType.map((r) => ({
                    type: r.type,
                    count: parseInt(r.count),
                })),
                reports_by_status: reportsByStatus.map((r) => ({
                    status: r.status,
                    count: parseInt(r.count),
                })),
                reports_by_tenant: reportsByTenant.map((r) => ({
                    tenant_id: r.tenant_id,
                    count: parseInt(r.count),
                })),
            };
        } catch (error) {
            console.info("Error fetching report stats:", error);
            throw error;
        }
    };

    const getReportAssets = async (reportId) => {
        return await models.report_assets.findAll({
            where: { report_id: reportId },
            include: [ASSOCIATION_MAP.report_assets.include[0]],
        });
    };

    const getReportCompliance = async (reportId) => {
        return await models.report_compliance.findAll({
            where: { report_id: reportId },
            include: [ASSOCIATION_MAP.report_compliance.include[0]],
        });
    };

    const getReportPolicies = async (reportId) => {
        return await models.report_policies.findAll({
            where: { report_id: reportId },
            include: [ASSOCIATION_MAP.report_policies.include[0]],
        });
    };

    const bulkDeleteReports = async (ids, userId = null) => {
        try {
            const reports = await models.reports.findAll({
                where: { id: { [Op.in]: ids } },
                attributes: ["id", "title", "type", "tenant_id"],
            });

            const deletedRowsCount = await models.reports.destroy({
                where: { id: { [Op.in]: ids } },
            });

            if (userId) {
                for (const report of reports) {
                    await auditService.createAuditLog({
                        tenant_id: report.tenant_id,
                        user_id: userId,
                        action: "DELETE",
                        entity_type: "report",
                        entity_id: report.id,
                        description: `Report deleted: ${report.title}`,
                        severity: "info",
                        source: "system",
                    });
                }
            }

            return { message: `${deletedRowsCount} reports deleted successfully` };
        } catch (error) {
            console.info("Error bulk deleting reports:", error);
            throw error;
        }
    };

    const bulkCreateReports = async (reportData, userId = null) => {
        try {
            const reports = await models.reports.bulkCreate(reportData);

            if (userId) {
                for (const report of reports) {
                    await auditService.createAuditLog({
                        tenant_id: report.tenant_id,
                        user_id: userId,
                        action: "CREATE",
                        entity_type: "report",
                        entity_id: report.id,
                        description: `Report created: ${report.title}`,
                        severity: "info",
                        source: "system",
                    });
                }
            }

            return reports;
        } catch (error) {
            console.info("Error bulk creating reports:", error);
            throw error;
        }
    };

    return {
        getAllReports,
        getReportById,
        createReport,
        updateReport,
        deleteReport,
        getReportsByTenant,
        getReportsByType,
        getReportsByStatus,
        getReportCount,
        getReportStats,
        getReportAssets,
        getReportCompliance,
        getReportPolicies,
        bulkDeleteReports,
        bulkCreateReports,
    };
};

export default reportServices;
