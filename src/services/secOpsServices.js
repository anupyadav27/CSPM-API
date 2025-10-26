import SecOps from "../models/secOps.js";
import AuditLog from "../models/auditLog.js";
import Tenant from "../models/tenant.js";
import runTransaction from "./transactionControl.js";

const secOpsServices = () => {
    const getAllSecOps = async (filters = {}, pagination = {}, sort = { createdAt: -1 }) => {
        try {
            let issues, total;

            const query = SecOps.find(filters).populate("tenantId", "_id name").sort(sort).lean();

            if (pagination.enabled) {
                const { skip, pageSize } = pagination;
                [issues, total] = await Promise.all([
                    query.skip(skip).limit(pageSize),
                    SecOps.countDocuments(filters),
                ]);
            } else {
                issues = await query;
                total = issues.length;
            }

            return {
                issues,
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
            console.error("Error fetching SecOps issues:", error);
            throw error;
        }
    };

    const getSecOpsById = async (id) => {
        try {
            return await SecOps.findById(id).populate("tenantId", "name").lean();
        } catch (error) {
            console.error("Error fetching SecOps issue by ID:", error);
            throw error;
        }
    };

    const createSecOps = async (data, createdBy = null) => {
        return runTransaction(async (session) => {
            const issue = new SecOps(data);
            await issue.save({ session });

            await AuditLog.create(
                [
                    {
                        action: "create_secops",
                        entityType: "SecOps",
                        entityId: issue._id,
                        userId: createdBy,
                        description: `SecOps issue '${issue.ruleName || issue.project}' created.`,
                        severity: "info",
                        metadata: { data },
                    },
                ],
                { session }
            );

            return issue.toObject();
        });
    };

    const updateSecOps = async (issueId, updates, updatedBy = null) => {
        return runTransaction(async (session) => {
            const old = await SecOps.findById(issueId).lean();
            if (!old) throw new Error("SecOps issue not found");

            const updated = await SecOps.findByIdAndUpdate(issueId, updates, {
                new: true,
                runValidators: true,
                session,
            }).lean();

            await AuditLog.create(
                [
                    {
                        action: "update_secops",
                        entityType: "SecOps",
                        entityId: issueId,
                        userId: updatedBy,
                        description: `SecOps issue '${updated.ruleName || updated.project}' updated.`,
                        severity: "info",
                        metadata: { before: old, after: updated },
                    },
                ],
                { session }
            );

            return updated;
        });
    };

    const deleteSecOps = async (issueId, deletedBy = null, softDelete = false) => {
        return runTransaction(async (session) => {
            let issue;

            if (softDelete) {
                issue = await SecOps.findByIdAndUpdate(
                    issueId,
                    { status: "resolved", fixedAt: new Date() },
                    { new: true, session }
                ).lean();
            } else {
                issue = await SecOps.findByIdAndDelete(issueId, { session }).lean();
            }

            if (!issue) throw new Error("SecOps issue not found");

            await AuditLog.create(
                [
                    {
                        action: softDelete ? "soft_delete_secops" : "delete_secops",
                        entityType: "SecOps",
                        entityId: issueId,
                        userId: deletedBy,
                        description: `SecOps issue '${issue.ruleName || issue.project}' ${
                            softDelete ? "soft-deleted" : "deleted"
                        }.`,
                        severity: softDelete ? "warning" : "critical",
                        metadata: { issueId },
                    },
                ],
                { session }
            );

            return issue;
        });
    };

    const markResolved = async (issueId, resolvedBy = null, notes = "") => {
        return runTransaction(async (session) => {
            const issue = await SecOps.findByIdAndUpdate(
                issueId,
                { status: "resolved", fixedAt: new Date() },
                { new: true, session }
            ).lean();

            if (!issue) throw new Error("SecOps issue not found");

            await AuditLog.create(
                [
                    {
                        action: "resolve_secops",
                        entityType: "SecOps",
                        entityId: issueId,
                        userId: resolvedBy,
                        description: `SecOps issue '${issue.ruleName || issue.project}' marked resolved.`,
                        severity: "info",
                        metadata: { notes },
                    },
                ],
                { session }
            );

            return issue;
        });
    };

    const reopenIssue = async (issueId, reopenedBy = null, notes = "") => {
        return runTransaction(async (session) => {
            const issue = await SecOps.findByIdAndUpdate(
                issueId,
                { status: "open", fixedAt: null },
                { new: true, session }
            ).lean();

            if (!issue) throw new Error("SecOps issue not found");

            await AuditLog.create(
                [
                    {
                        action: "reopen_secops",
                        entityType: "SecOps",
                        entityId: issueId,
                        userId: reopenedBy,
                        description: `SecOps issue '${issue.ruleName || issue.project}' reopened.`,
                        severity: "info",
                        metadata: { notes },
                    },
                ],
                { session }
            );

            return issue;
        });
    };

    const bulkImportSecOps = async (issuesData = [], importedBy = null) => {
        return runTransaction(async (session) => {
            const issues = await SecOps.insertMany(issuesData, { session });

            await AuditLog.create(
                [
                    {
                        action: "bulk_import_secops",
                        entityType: "SecOps",
                        entityId: null,
                        userId: importedBy,
                        description: `${issues.length} SecOps issues imported in bulk.`,
                        severity: "info",
                        metadata: { count: issues.length },
                    },
                ],
                { session }
            );

            return issues;
        });
    };

    const getStatsBySeverity = async (filters = {}) => {
        const stats = await SecOps.aggregate([
            { $match: filters },
            { $group: { _id: "$severity", count: { $sum: 1 } } },
        ]);
        return stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {});
    };

    const getStatsByReportType = async (filters = {}) => {
        const stats = await SecOps.aggregate([
            { $match: filters },
            { $group: { _id: "$reportType", count: { $sum: 1 } } },
        ]);
        return stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {});
    };

    const getRecentSecOps = async (tenantId = null, days = 7) => {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const filter = { createdAt: { $gte: since } };
        if (tenantId) filter.tenantId = tenantId;

        return await SecOps.find(filter).sort({ createdAt: -1 }).limit(50).lean();
    };

    const assignOwner = async (issueId, owner, assignedBy = null) => {
        return runTransaction(async (session) => {
            const issue = await SecOps.findByIdAndUpdate(
                issueId,
                { owner, updatedAt: new Date() },
                { new: true, session }
            ).lean();

            if (!issue) throw new Error("SecOps issue not found");

            await AuditLog.create(
                [
                    {
                        action: "assign_owner_secops",
                        entityType: "SecOps",
                        entityId: issueId,
                        userId: assignedBy,
                        description: `Owner assigned to SecOps issue '${issue.ruleName || issue.project}'.`,
                        severity: "info",
                        metadata: { owner },
                    },
                ],
                { session }
            );

            return issue;
        });
    };

    const addTag = async (issueId, tag, addedBy = null) => {
        return runTransaction(async (session) => {
            const issue = await SecOps.findByIdAndUpdate(
                issueId,
                { $addToSet: { tags: tag }, updatedAt: new Date() },
                { new: true, session }
            ).lean();

            await AuditLog.create(
                [
                    {
                        action: "add_tag_secops",
                        entityType: "SecOps",
                        entityId: issueId,
                        userId: addedBy,
                        description: `Tag '${tag}' added to SecOps issue '${issue.ruleName || issue.project}'.`,
                        severity: "info",
                        metadata: { tag },
                    },
                ],
                { session }
            );

            return issue;
        });
    };

    const removeTag = async (issueId, tag, removedBy = null) => {
        return runTransaction(async (session) => {
            const issue = await SecOps.findByIdAndUpdate(
                issueId,
                { $pull: { tags: tag }, updatedAt: new Date() },
                { new: true, session }
            ).lean();

            await AuditLog.create(
                [
                    {
                        action: "remove_tag_secops",
                        entityType: "SecOps",
                        entityId: issueId,
                        userId: removedBy,
                        description: `Tag '${tag}' removed from SecOps issue '${issue.ruleName || issue.project}'.`,
                        severity: "info",
                        metadata: { tag },
                    },
                ],
                { session }
            );

            return issue;
        });
    };

    return {
        getAllSecOps,
        getSecOpsById,
        createSecOps,
        updateSecOps,
        deleteSecOps,
        markResolved,
        reopenIssue,
        bulkImportSecOps,
        getStatsBySeverity,
        getStatsByReportType,
        getRecentSecOps,
        assignOwner,
        addTag,
        removeTag,
    };
};

export default secOpsServices;
