import Threat from "../models/threat.js";
import AuditLog from "../models/auditLog.js";
import Tenant from "../models/tenant.js";
import Asset from "../models/asset.js";
import runTransaction from "./transactionControl.js";

const threatServices = () => {
    const getAllThreats = async (filters = {}, pagination = {}, sort = { detectedAt: -1 }) => {
        try {
            let threats, total;

            const query = Threat.find(filters)
                .populate("tenantId", "_id name")
                .populate("assetId", "_id name type region")
                .sort(sort)
                .lean();

            if (pagination.enabled) {
                const { skip, pageSize } = pagination;
                [threats, total] = await Promise.all([
                    query.skip(skip).limit(pageSize),
                    Threat.countDocuments(filters),
                ]);
            } else {
                threats = await query;
                total = threats.length;
            }

            return {
                threats,
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
            console.error("Error fetching threats:", error);
            throw error;
        }
    };

    const getThreatById = async (id) => {
        try {
            return await Threat.findById(id)
                .populate("tenantId", "name")
                .populate("assetId", "name type region")
                .lean();
        } catch (error) {
            console.error("Error fetching threat by ID:", error);
            throw error;
        }
    };

    const createThreat = async (data, createdBy = null) => {
        return runTransaction(async (session) => {
            const threat = new Threat(data);
            await threat.save({ session });

            await AuditLog.create(
                [
                    {
                        action: "create_threat",
                        entityType: "Threat",
                        entityId: threat._id,
                        userId: createdBy,
                        description: `Threat '${threat.title}' created.`,
                        severity: "info",
                        metadata: { data },
                    },
                ],
                { session }
            );

            return threat.toObject();
        });
    };

    const updateThreat = async (threatId, updates, updatedBy = null) => {
        return runTransaction(async (session) => {
            const old = await Threat.findById(threatId).lean();
            if (!old) throw new Error("Threat not found");

            const updated = await Threat.findByIdAndUpdate(threatId, updates, {
                new: true,
                runValidators: true,
                session,
            }).lean();

            await AuditLog.create(
                [
                    {
                        action: "update_threat",
                        entityType: "Threat",
                        entityId: threatId,
                        userId: updatedBy,
                        description: `Threat '${updated.title}' updated.`,
                        severity: "info",
                        metadata: { before: old, after: updated },
                    },
                ],
                { session }
            );

            return updated;
        });
    };

    const deleteThreat = async (threatId, deletedBy = null, softDelete = false) => {
        return runTransaction(async (session) => {
            let threat;

            if (softDelete) {
                threat = await Threat.findByIdAndUpdate(
                    threatId,
                    { status: "false_positive" },
                    { new: true, session }
                ).lean();
            } else {
                threat = await Threat.findByIdAndDelete(threatId, { session }).lean();
            }

            if (!threat) throw new Error("Threat not found");

            await AuditLog.create(
                [
                    {
                        action: softDelete ? "soft_delete_threat" : "delete_threat",
                        entityType: "Threat",
                        entityId: threatId,
                        userId: deletedBy,
                        description: `Threat '${threat.title}' ${
                            softDelete ? "soft-deleted" : "deleted"
                        }.`,
                        severity: softDelete ? "warning" : "critical",
                        metadata: { threatId },
                    },
                ],
                { session }
            );

            return threat;
        });
    };

    const resolveThreat = async (threatId, resolvedBy = null, notes = "") => {
        return runTransaction(async (session) => {
            const threat = await Threat.findByIdAndUpdate(
                threatId,
                { status: "resolved", resolvedAt: new Date(), lastUpdatedAt: new Date() },
                { new: true, session }
            ).lean();

            if (!threat) throw new Error("Threat not found");

            await AuditLog.create(
                [
                    {
                        action: "resolve_threat",
                        entityType: "Threat",
                        entityId: threatId,
                        userId: resolvedBy,
                        description: `Threat '${threat.title}' resolved.`,
                        severity: "info",
                        metadata: { notes },
                    },
                ],
                { session }
            );

            return threat;
        });
    };

    const markFalsePositive = async (threatId, markedBy = null, notes = "") => {
        return runTransaction(async (session) => {
            const threat = await Threat.findByIdAndUpdate(
                threatId,
                { status: "false_positive", lastUpdatedAt: new Date() },
                { new: true, session }
            ).lean();

            await AuditLog.create(
                [
                    {
                        action: "mark_false_positive",
                        entityType: "Threat",
                        entityId: threatId,
                        userId: markedBy,
                        description: `Threat '${threat.title}' marked as false positive.`,
                        severity: "warning",
                        metadata: { notes },
                    },
                ],
                { session }
            );

            return threat;
        });
    };

    const updateRemediation = async (threatId, remediation, updatedBy = null) => {
        return runTransaction(async (session) => {
            const threat = await Threat.findByIdAndUpdate(
                threatId,
                { remediation, lastUpdatedAt: new Date() },
                { new: true, session }
            ).lean();

            await AuditLog.create(
                [
                    {
                        action: "update_threat_remediation",
                        entityType: "Threat",
                        entityId: threatId,
                        userId: updatedBy,
                        description: `Threat '${threat.title}' remediation updated.`,
                        severity: "info",
                        metadata: { remediation },
                    },
                ],
                { session }
            );

            return threat;
        });
    };

    const linkFindings = async (threatId, findings = [], linkedBy = null) => {
        return runTransaction(async (session) => {
            const threat = await Threat.findByIdAndUpdate(
                threatId,
                { $addToSet: { relatedFindings: { $each: findings } }, lastUpdatedAt: new Date() },
                { new: true, session }
            ).lean();

            await AuditLog.create(
                [
                    {
                        action: "link_findings",
                        entityType: "Threat",
                        entityId: threatId,
                        userId: linkedBy,
                        description: `Linked findings to threat '${threat.title}'.`,
                        severity: "info",
                        metadata: { findings },
                    },
                ],
                { session }
            );

            return threat;
        });
    };

    const bulkImportThreats = async (threatsData = [], importedBy = null) => {
        return runTransaction(async (session) => {
            const threats = await Threat.insertMany(threatsData, { session });

            await AuditLog.create(
                [
                    {
                        action: "bulk_import_threats",
                        entityType: "Threat",
                        entityId: null,
                        userId: importedBy,
                        description: `${threats.length} threats imported in bulk.`,
                        severity: "info",
                        metadata: { count: threats.length },
                    },
                ],
                { session }
            );

            return threats;
        });
    };

    const getStatsBySeverity = async (filters = {}) => {
        const stats = await Threat.aggregate([
            { $match: filters },
            { $group: { _id: "$severity", count: { $sum: 1 } } },
        ]);
        return stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {});
    };

    const getRecentThreats = async (tenantId = null, days = 7) => {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const filter = { detectedAt: { $gte: since } };
        if (tenantId) filter.tenantId = tenantId;

        return await Threat.find(filter).sort({ detectedAt: -1 }).limit(50).lean();
    };

    return {
        getAllThreats,
        getThreatById,
        createThreat,
        updateThreat,
        deleteThreat,
        resolveThreat,
        markFalsePositive,
        updateRemediation,
        linkFindings,
        bulkImportThreats,
        getStatsBySeverity,
        getRecentThreats,
    };
};

export default threatServices;
