import Report from "../models/report.js";
import AuditLog from "../models/auditLog.js";
import Tenant from "../models/tenant.js";
import Asset from "../models/asset.js";
import runTransaction from "./transactionControl.js";

const reportServices = () => {
    const getAllReports = async (filters = {}, pagination = {}, sort = { generatedAt: -1 }) => {
        try {
            let reports, total;

            const query = Report.find(filters)
                .populate("tenantId", "_id name")
                .populate("generatedBy", "_id name email")
                .populate("relatedAssets", "_id name type region")
                .populate("relatedPolicies", "_id title")
                .populate("relatedCompliance", "_id framework title")
                .sort(sort)
                .lean();

            if (pagination.enabled) {
                const { skip, pageSize } = pagination;
                [reports, total] = await Promise.all([
                    query.skip(skip).limit(pageSize),
                    Report.countDocuments(filters),
                ]);
            } else {
                reports = await query;
                total = reports.length;
            }

            return {
                reports,
                pagination: {
                    total,
                    pageSize: pagination.enabled ? pagination.pageSize : total,
                    currentPage: pagination.enabled
                        ? Math.floor(pagination.skip / pagination.pageSize) + 1
                        : 1,
                    totalPages: pagination.enabled ? Math.ceil(total / pagination.pageSize) : 1,
                },
            };
        } catch (error) {
            console.error("Error fetching reports:", error);
            throw error;
        }
    };

    const getReportById = async (id) => {
        try {
            return await Report.findById(id)
                .populate("tenantId", "name")
                .populate("generatedBy", "name email")
                .populate("relatedAssets", "name type region")
                .populate("relatedPolicies", "title")
                .populate("relatedCompliance", "framework title")
                .lean();
        } catch (error) {
            console.error("Error fetching report by ID:", error);
            throw error;
        }
    };

    const createReport = async (data, createdBy = null) => {
        return runTransaction(async (session) => {
            const report = new Report(data);
            await report.save({ session });

            await AuditLog.create(
                [
                    {
                        action: "create_report",
                        entityType: "Report",
                        entityId: report._id,
                        userId: createdBy,
                        description: `Report '${report.title}' created.`,
                        severity: "info",
                        metadata: { data },
                    },
                ],
                { session }
            );

            return report.toObject();
        });
    };

    const updateReport = async (reportId, updates, updatedBy = null) => {
        return runTransaction(async (session) => {
            const old = await Report.findById(reportId).lean();
            if (!old) throw new Error("Report not found");

            const updated = await Report.findByIdAndUpdate(reportId, updates, {
                new: true,
                runValidators: true,
                session,
            }).lean();

            await AuditLog.create(
                [
                    {
                        action: "update_report",
                        entityType: "Report",
                        entityId: reportId,
                        userId: updatedBy,
                        description: `Report '${updated.title}' updated.`,
                        severity: "info",
                        metadata: { before: old, after: updated },
                    },
                ],
                { session }
            );

            return updated;
        });
    };

    const deleteReport = async (reportId, deletedBy = null) => {
        return runTransaction(async (session) => {
            const report = await Report.findByIdAndDelete(reportId, { session }).lean();
            if (!report) throw new Error("Report not found");

            await AuditLog.create(
                [
                    {
                        action: "delete_report",
                        entityType: "Report",
                        entityId: reportId,
                        userId: deletedBy,
                        description: `Report '${report.title}' deleted.`,
                        severity: "critical",
                        metadata: { reportId },
                    },
                ],
                { session }
            );

            return report;
        });
    };

    const markReportCompleted = async (
        reportId,
        fileUrl,
        exportMetadata = {},
        updatedBy = null
    ) => {
        return runTransaction(async (session) => {
            const report = await Report.findByIdAndUpdate(
                reportId,
                {
                    status: "completed",
                    fileUrl,
                    exportMetadata,
                    generatedAt: new Date(),
                },
                { new: true, session }
            ).lean();

            await AuditLog.create(
                [
                    {
                        action: "complete_report",
                        entityType: "Report",
                        entityId: reportId,
                        userId: updatedBy,
                        description: `Report '${report.title}' marked as completed.`,
                        severity: "info",
                        metadata: { fileUrl, exportMetadata },
                    },
                ],
                { session }
            );

            return report;
        });
    };

    const markReportFailed = async (reportId, errorMessage, updatedBy = null) => {
        return runTransaction(async (session) => {
            const report = await Report.findByIdAndUpdate(
                reportId,
                { status: "failed", errorMessage },
                { new: true, session }
            ).lean();

            await AuditLog.create(
                [
                    {
                        action: "fail_report",
                        entityType: "Report",
                        entityId: reportId,
                        userId: updatedBy,
                        description: `Report '${report.title}' marked as failed.`,
                        severity: "error",
                        metadata: { errorMessage },
                    },
                ],
                { session }
            );

            return report;
        });
    };

    const scheduleReport = async (reportId, scheduleConfig, updatedBy = null) => {
        return runTransaction(async (session) => {
            const report = await Report.findByIdAndUpdate(
                reportId,
                { scheduled: true, scheduleConfig },
                { new: true, session }
            ).lean();

            await AuditLog.create(
                [
                    {
                        action: "schedule_report",
                        entityType: "Report",
                        entityId: reportId,
                        userId: updatedBy,
                        description: `Report '${report.title}' scheduled.`,
                        severity: "info",
                        metadata: { scheduleConfig },
                    },
                ],
                { session }
            );

            return report;
        });
    };

    const unscheduleReport = async (reportId, updatedBy = null) => {
        return runTransaction(async (session) => {
            const report = await Report.findByIdAndUpdate(
                reportId,
                { scheduled: false, scheduleConfig: {} },
                { new: true, session }
            ).lean();

            await AuditLog.create(
                [
                    {
                        action: "unschedule_report",
                        entityType: "Report",
                        entityId: reportId,
                        userId: updatedBy,
                        description: `Report '${report.title}' unscheduled.`,
                        severity: "warning",
                        metadata: {},
                    },
                ],
                { session }
            );

            return report;
        });
    };

    const bulkImportReports = async (reportsData = [], importedBy = null) => {
        return runTransaction(async (session) => {
            const reports = await Report.insertMany(reportsData, { session });

            await AuditLog.create(
                [
                    {
                        action: "bulk_import_reports",
                        entityType: "Report",
                        entityId: null,
                        userId: importedBy,
                        description: `${reports.length} reports imported in bulk.`,
                        severity: "info",
                        metadata: { count: reports.length },
                    },
                ],
                { session }
            );

            return reports;
        });
    };

    const getStatsByType = async (filters = {}) => {
        const stats = await Report.aggregate([
            { $match: filters },
            { $group: { _id: "$type", count: { $sum: 1 } } },
        ]);
        return stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {});
    };

    const getStatsByStatus = async (filters = {}) => {
        const stats = await Report.aggregate([
            { $match: filters },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);
        return stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {});
    };

    const getRecentReports = async (tenantId = null, days = 7) => {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const filter = { generatedAt: { $gte: since } };
        if (tenantId) filter.tenantId = tenantId;

        return await Report.find(filter).sort({ generatedAt: -1 }).limit(50).lean();
    };

    return {
        getAllReports,
        getReportById,
        createReport,
        updateReport,
        deleteReport,
        markReportCompleted,
        markReportFailed,
        scheduleReport,
        unscheduleReport,
        bulkImportReports,
        getStatsByType,
        getStatsByStatus,
        getRecentReports,
    };
};

export default reportServices;
