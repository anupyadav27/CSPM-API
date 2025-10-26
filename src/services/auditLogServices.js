import AuditLog from "../models/auditLog.js";

const auditLogServices = {
    async createLog({
        tenantId,
        userId,
        action,
        entityType,
        entityId,
        description,
        before,
        after,
        severity = "info",
        source = "user",
        req = {},
    }) {
        try {
            if (!tenantId) throw new Error("tenantId required for audit log");
            if (!action) throw new Error("action is required for audit log");

            const log = new AuditLog({
                tenantId,
                userId,
                action,
                entityType,
                entityId,
                description,
                before,
                after,
                ipAddress: req.ip || req.headers?.["x-forwarded-for"],
                userAgent: req.headers?.["user-agent"],
                requestId: req.requestId || null,
                method: req.method,
                endpoint: req.originalUrl,
                severity,
                source,
            });

            await log.save();
            return log;
        } catch (err) {
            console.error("Audit log creation failed:", err.message);
        }
    },

    async getLogs(filters = {}, pagination = {}) {
        try {
            const query = AuditLog.find(filters).sort({ timestamp: -1 });

            if (pagination.enabled) {
                const { skip, pageSize } = pagination;
                const [logs, total] = await Promise.all([
                    query.skip(skip).limit(pageSize).lean(),
                    AuditLog.countDocuments(filters),
                ]);

                return {
                    success: true,
                    logs,
                    pagination: {
                        total,
                        pageSize,
                        currentPage: Math.floor(skip / pageSize) + 1,
                        totalPages: Math.ceil(total / pageSize),
                    },
                };
            }

            const logs = await query.lean();
            return { success: true, logs };
        } catch (err) {
            console.error("Error fetching audit logs:", err);
            throw err;
        }
    },

    async getLogById(id) {
        try {
            const log = await AuditLog.findById(id).lean();
            if (!log) throw new Error("Audit log not found");
            return { success: true, log };
        } catch (err) {
            console.error("Error fetching audit log:", err);
            throw err;
        }
    },

    async deleteOldLogs(days = 90) {
        try {
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - days);

            const result = await AuditLog.deleteMany({ timestamp: { $lt: cutoff } });
            return {
                success: true,
                deletedCount: result.deletedCount,
                message: `Deleted ${result.deletedCount} logs older than ${days} days`,
            };
        } catch (err) {
            console.error("Error deleting old logs:", err);
            throw err;
        }
    },
};

export default auditLogServices;
