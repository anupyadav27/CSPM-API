import Policy from "../models/policy.js";
import AuditLog from "../models/auditLog.js";
import runTransaction from "./transactionControl.js";

const policyServices = () => {
    const getAllPolicies = async (
        filters = {},
        pagination = {},
        searchFields = {},
        sort = { createdAt: -1 }
    ) => {
        try {
            let policies, total;
            const queryFilters = { ...filters };

            // 🔍 Handle double-underscore based field searches (supports nested paths)
            for (const [key, value] of Object.entries(searchFields)) {
                if (value && value.trim() !== "") {
                    const fieldPath = key.replace("_search", "").replace(/__/g, ".");
                    queryFilters[fieldPath] = { $regex: value.trim(), $options: "i" };
                }
            }

            const query = Policy.find(queryFilters)
                .sort(sort)
                .populate([
                    { path: "tenantId", select: "_id name" },
                    { path: "createdBy", select: "_id email" },
                    { path: "updatedBy", select: "_id email" },
                    { path: "linkedAssets", select: "_id name type" },
                ])
                .lean();

            if (pagination.enabled) {
                const { skip, pageSize } = pagination;
                [policies, total] = await Promise.all([
                    query.skip(skip).limit(pageSize),
                    Policy.countDocuments(filters),
                ]);
            } else {
                policies = await query;
                total = policies.length;
            }

            return {
                policies,
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
            console.error("Error fetching policies:", error);
            throw error;
        }
    };

    const getPolicyById = async (policyId) => {
        try {
            return await Policy.findById(policyId)
                .populate([
                    { path: "tenantId", select: "_id name" },
                    { path: "createdBy", select: "_id email" },
                    { path: "updatedBy", select: "_id email" },
                    { path: "linkedAssets", select: "_id name type" },
                ])
                .lean();
        } catch (error) {
            console.error("Error fetching policy by ID:", error);
            throw error;
        }
    };

    const createPolicy = async (policyData, createdBy = null) => {
        return runTransaction(async (session) => {
            const policy = new Policy({
                ...policyData,
                createdBy,
                updatedBy: createdBy,
            });
            await policy.save({ session });

            await AuditLog.create(
                [
                    {
                        action: "create_policy",
                        entityType: "Policy",
                        entityId: policy._id,
                        userId: createdBy,
                        description: `Policy '${policy.name}' created.`,
                        severity: "info",
                        metadata: { policyData },
                    },
                ],
                { session }
            );

            return policy.toObject();
        });
    };

    const updatePolicy = async (policyId, updates, updatedBy = null) => {
        return runTransaction(async (session) => {
            const oldPolicy = await Policy.findById(policyId).lean();
            if (!oldPolicy) throw new Error("Policy not found");

            // Save old version for history
            const previousVersion = {
                version: oldPolicy.version,
                document: oldPolicy.document,
                updatedAt: new Date(),
                updatedBy,
            };

            const policy = await Policy.findByIdAndUpdate(
                policyId,
                {
                    ...updates,
                    version: oldPolicy.version + 1,
                    updatedBy,
                    $push: { previousVersions: previousVersion },
                },
                { new: true, runValidators: true, session }
            ).lean();

            await AuditLog.create(
                [
                    {
                        action: "update_policy",
                        entityType: "Policy",
                        entityId: policy._id,
                        userId: updatedBy,
                        description: `Policy '${policy.name}' updated.`,
                        severity: "info",
                        metadata: { before: oldPolicy, after: policy },
                    },
                ],
                { session }
            );

            return policy;
        });
    };

    const deletePolicy = async (policyId, deletedBy = null, softDelete = false) => {
        return runTransaction(async (session) => {
            let policy;
            if (softDelete) {
                policy = await Policy.findByIdAndUpdate(
                    policyId,
                    { validationStatus: "unknown", complianceStatus: "unknown" },
                    { new: true, session }
                ).lean();
            } else {
                policy = await Policy.findByIdAndDelete(policyId, { session }).lean();
            }

            if (!policy) throw new Error("Policy not found");

            await AuditLog.create(
                [
                    {
                        action: softDelete ? "soft_delete_policy" : "delete_policy",
                        entityType: "Policy",
                        entityId: policy._id,
                        userId: deletedBy,
                        description: `Policy '${policy.name}' ${softDelete ? "soft-deleted" : "deleted"}.`,
                        severity: softDelete ? "warning" : "critical",
                        metadata: { policyId },
                    },
                ],
                { session }
            );

            return policy;
        });
    };

    const updateValidationStatus = async (policyId, status, updatedBy = null) => {
        return runTransaction(async (session) => {
            const oldPolicy = await Policy.findById(policyId).lean();
            if (!oldPolicy) throw new Error("Policy not found");

            const policy = await Policy.findByIdAndUpdate(
                policyId,
                { validationStatus: status, updatedBy },
                { new: true, session }
            ).lean();

            await AuditLog.create(
                [
                    {
                        action: "update_validation_status",
                        entityType: "Policy",
                        entityId: policy._id,
                        userId: updatedBy,
                        description: `Policy '${policy.name}' validation status changed to '${status}'.`,
                        severity: "info",
                        metadata: { before: oldPolicy.validationStatus, after: status },
                    },
                ],
                { session }
            );

            return policy;
        });
    };

    const updateComplianceStatus = async (policyId, status, updatedBy = null) => {
        return runTransaction(async (session) => {
            const oldPolicy = await Policy.findById(policyId).lean();
            if (!oldPolicy) throw new Error("Policy not found");

            const policy = await Policy.findByIdAndUpdate(
                policyId,
                { complianceStatus: status, updatedBy },
                { new: true, session }
            ).lean();

            await AuditLog.create(
                [
                    {
                        action: "update_compliance_status",
                        entityType: "Policy",
                        entityId: policy._id,
                        userId: updatedBy,
                        description: `Policy '${policy.name}' compliance status changed to '${status}'.`,
                        severity: "info",
                        metadata: { before: oldPolicy.complianceStatus, after: status },
                    },
                ],
                { session }
            );

            return policy;
        });
    };

    const recordEnforcementLog = async (policyId, result, triggeredBy = null) => {
        return runTransaction(async (session) => {
            const update = {
                $push: {
                    enforcementLogs: {
                        timestamp: new Date(),
                        result,
                        triggeredBy,
                    },
                },
                enforcementStatus: result === "success" ? "enforced" : "not_enforced",
                lastEvaluatedAt: new Date(),
            };

            const policy = await Policy.findByIdAndUpdate(policyId, update, {
                new: true,
                session,
            }).lean();

            await AuditLog.create(
                [
                    {
                        action: "record_enforcement_log",
                        entityType: "Policy",
                        entityId: policy._id,
                        userId: triggeredBy,
                        description: `Policy '${policy.name}' enforcement recorded.`,
                        severity: result === "success" ? "info" : "warning",
                        metadata: { result },
                    },
                ],
                { session }
            );

            return policy;
        });
    };

    const linkAssets = async (policyId, assetIds = [], updatedBy = null) => {
        return runTransaction(async (session) => {
            const policy = await Policy.findByIdAndUpdate(
                policyId,
                { $addToSet: { linkedAssets: { $each: assetIds } }, updatedBy },
                { new: true, session }
            ).lean();

            await AuditLog.create(
                [
                    {
                        action: "link_assets",
                        entityType: "Policy",
                        entityId: policy._id,
                        userId: updatedBy,
                        description: `Linked assets to policy '${policy.name}'.`,
                        severity: "info",
                        metadata: { assetIds },
                    },
                ],
                { session }
            );

            return policy;
        });
    };

    const unlinkAssets = async (policyId, assetIds = [], updatedBy = null) => {
        return runTransaction(async (session) => {
            const policy = await Policy.findByIdAndUpdate(
                policyId,
                { $pull: { linkedAssets: { $in: assetIds } }, updatedBy },
                { new: true, session }
            ).lean();

            await AuditLog.create(
                [
                    {
                        action: "unlink_assets",
                        entityType: "Policy",
                        entityId: policy._id,
                        userId: updatedBy,
                        description: `Unlinked assets from policy '${policy.name}'.`,
                        severity: "info",
                        metadata: { assetIds },
                    },
                ],
                { session }
            );

            return policy;
        });
    };

    const getPoliciesByTenant = async (tenantId) => {
        try {
            return await Policy.find({ tenantId }).lean();
        } catch (error) {
            console.error("Error fetching policies by tenant:", error);
            throw error;
        }
    };

    const getPolicyByName = async (tenantId, name) => {
        try {
            return await Policy.findOne({
                tenantId,
                name: name.trim(),
            }).lean();
        } catch (error) {
            console.error("Error fetching policy by name:", error);
            throw error;
        }
    };

    return {
        getAllPolicies,
        getPolicyById,
        createPolicy,
        updatePolicy,
        deletePolicy,
        updateValidationStatus,
        updateComplianceStatus,
        recordEnforcementLog,
        linkAssets,
        unlinkAssets,
        getPoliciesByTenant,
        getPolicyByName,
    };
};

export default policyServices;
