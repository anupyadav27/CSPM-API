import crypto from "crypto";

import policyServices from "../services/policyServices.js";
import { exportToExcel, exportToPDFBuffer } from "../utils/exporter.js";

const ALLOWED_FILTERS = ["tenant_id", "category", "validation_status", "compliance_status", "created_at", "updated_at", "name", "description"];

export const getAllPoliciesController = async (req, res) => {
    try {
        const filters = {};

        ALLOWED_FILTERS.forEach((field) => {
            const value = req.query[field];
            if (value !== undefined && value !== null && value !== "") {
                filters[field] = String(value).trim();
            }
        });

        Object.entries(req.query).forEach(([key, value]) => {
            if (key.includes("__") && value !== null && String(value).trim() !== "" && !key.endsWith("_search")) {
                filters[key] = String(value).trim();
            }
        });

        const searchFields = {};
        for (const [key, value] of Object.entries(req.query)) {
            if (key.endsWith("_search") && value !== null && String(value).trim() !== "") {
                searchFields[key] = String(value).trim();
            }
        }

        const sort = {};
        if (req.query.sort_by) {
            sort[req.query.sort_by] = req.query.order === "asc" ? "ASC" : "DESC";
        } else {
            sort.created_at = "DESC";
        }

        const result = await policyServices().getAllPolicies(filters, req.pagination, searchFields, sort);

        const jsonResponse = {
            success: true,
            message: "Policies Fetched Successfully",
            data: result.policies,
            pagination: result.pagination,
        };

        const etag = crypto.createHash("md5").update(JSON.stringify(jsonResponse)).digest("hex");

        const clientETag = req.headers["if-none-match"];
        if (clientETag && clientETag === etag) {
            return res.status(304).end();
        }

        res.setHeader("Cache-Control", "private, max-age=300, stale-while-revalidate=120");
        res.setHeader("Vary", "Cookie");
        res.setHeader("ETag", etag);
        res.setHeader("Content-Type", "application/json");

        return res.status(200).json(jsonResponse);
    } catch (error) {
        console.info("Error in getAllPoliciesController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch policies",
        });
    }
};

export const getPolicyByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const policy = await policyServices().getPolicyById(id);

        if (!policy) {
            return res.status(404).json({
                success: false,
                message: "Policy not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Policy fetched successfully",
            data: policy,
        });
    } catch (error) {
        console.info("Error in getPolicyByIdController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch policy",
        });
    }
};

export const createPolicyController = async (req, res) => {
    try {
        const policy = await policyServices().createPolicy(req.body, req.user?.id);

        return res.status(201).json({
            success: true,
            message: "Policy created successfully",
            data: policy,
        });
    } catch (error) {
        console.info("Error in createPolicyController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create policy",
        });
    }
};

export const updatePolicyController = async (req, res) => {
    try {
        const { id } = req.params;
        const policy = await policyServices().updatePolicy(id, req.body, req.user?.id);

        if (!policy) {
            return res.status(404).json({
                success: false,
                message: "Policy not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Policy updated successfully",
            data: policy,
        });
    } catch (error) {
        console.info("Error in updatePolicyController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update policy",
        });
    }
};

export const deletePolicyController = async (req, res) => {
    try {
        const { id } = req.params;
        await policyServices().deletePolicy(id, req.user?.id);

        return res.status(200).json({
            success: true,
            message: "Policy deleted successfully",
        });
    } catch (error) {
        console.info("Error in deletePolicyController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete policy",
        });
    }
};

export const getPoliciesByTenantController = async (req, res) => {
    try {
        const { tenantId } = req.params;

        const filters = {};
        filters.tenant_id = tenantId;

        ALLOWED_FILTERS.forEach((field) => {
            if (field !== "tenant_id") {
                const value = req.query[field];
                if (value !== undefined && value !== null && value !== "") {
                    filters[field] = String(value).trim();
                }
            }
        });

        Object.entries(req.query).forEach(([key, value]) => {
            if (key.includes("__") && value !== null && String(value).trim() !== "" && !key.endsWith("_search")) {
                filters[key] = String(value).trim();
            }
        });

        const searchFields = {};
        for (const [key, value] of Object.entries(req.query)) {
            if (key.endsWith("_search") && value !== null && String(value).trim() !== "") {
                searchFields[key] = String(value).trim();
            }
        }

        const sort = {};
        if (req.query.sort_by) {
            sort[req.query.sort_by] = req.query.order === "asc" ? "ASC" : "DESC";
        } else {
            sort.created_at = "DESC";
        }

        const result = await policyServices().getPoliciesByTenant(tenantId, filters, req.pagination, searchFields, sort);

        const jsonResponse = {
            success: true,
            message: "Policies Fetched Successfully",
            data: result.policies,
            pagination: result.pagination,
        };

        const etag = crypto.createHash("md5").update(JSON.stringify(jsonResponse)).digest("hex");

        const clientETag = req.headers["if-none-match"];
        if (clientETag && clientETag === etag) {
            return res.status(304).end();
        }

        res.setHeader("Cache-Control", "private, max-age=300, stale-while-revalidate=120");
        res.setHeader("Vary", "Cookie");
        res.setHeader("ETag", etag);
        res.setHeader("Content-Type", "application/json");

        return res.status(200).json(jsonResponse);
    } catch (error) {
        console.info("Error in getPoliciesByTenantController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch policies",
        });
    }
};

export const getPoliciesByCategoryController = async (req, res) => {
    try {
        const { category } = req.params;

        const filters = {};

        ALLOWED_FILTERS.forEach((field) => {
            if (field !== "category") {
                const value = req.query[field];
                if (value !== undefined && value !== null && value !== "") {
                    filters[field] = String(value).trim();
                }
            }
        });

        Object.entries(req.query).forEach(([key, value]) => {
            if (key.includes("__") && value !== null && String(value).trim() !== "" && !key.endsWith("_search")) {
                filters[key] = String(value).trim();
            }
        });

        const searchFields = {};
        for (const [key, value] of Object.entries(req.query)) {
            if (key.endsWith("_search") && value !== null && String(value).trim() !== "") {
                searchFields[key] = String(value).trim();
            }
        }

        const sort = {};
        if (req.query.sort_by) {
            sort[req.query.sort_by] = req.query.order === "asc" ? "ASC" : "DESC";
        } else {
            sort.created_at = "DESC";
        }

        const result = await policyServices().getPoliciesByCategory(category, filters, req.pagination, searchFields, sort);

        const jsonResponse = {
            success: true,
            message: "Policies Fetched Successfully",
            data: result.policies,
            pagination: result.pagination,
        };

        const etag = crypto.createHash("md5").update(JSON.stringify(jsonResponse)).digest("hex");

        const clientETag = req.headers["if-none-match"];
        if (clientETag && clientETag === etag) {
            return res.status(304).end();
        }

        res.setHeader("Cache-Control", "private, max-age=300, stale-while-revalidate=120");
        res.setHeader("Vary", "Cookie");
        res.setHeader("ETag", etag);
        res.setHeader("Content-Type", "application/json");

        return res.status(200).json(jsonResponse);
    } catch (error) {
        console.info("Error in getPoliciesByCategoryController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch policies",
        });
    }
};

export const getPoliciesByValidationStatusController = async (req, res) => {
    try {
        const { validationStatus } = req.params;

        const filters = {};

        ALLOWED_FILTERS.forEach((field) => {
            if (field !== "validation_status") {
                const value = req.query[field];
                if (value !== undefined && value !== null && value !== "") {
                    filters[field] = String(value).trim();
                }
            }
        });

        Object.entries(req.query).forEach(([key, value]) => {
            if (key.includes("__") && value !== null && String(value).trim() !== "" && !key.endsWith("_search")) {
                filters[key] = String(value).trim();
            }
        });

        const searchFields = {};
        for (const [key, value] of Object.entries(req.query)) {
            if (key.endsWith("_search") && value !== null && String(value).trim() !== "") {
                searchFields[key] = String(value).trim();
            }
        }

        const sort = {};
        if (req.query.sort_by) {
            sort[req.query.sort_by] = req.query.order === "asc" ? "ASC" : "DESC";
        } else {
            sort.created_at = "DESC";
        }

        const result = await policyServices().getPoliciesByValidationStatus(validationStatus, filters, req.pagination, searchFields, sort);

        const jsonResponse = {
            success: true,
            message: "Policies Fetched Successfully",
            data: result.policies,
            pagination: result.pagination,
        };

        const etag = crypto.createHash("md5").update(JSON.stringify(jsonResponse)).digest("hex");

        const clientETag = req.headers["if-none-match"];
        if (clientETag && clientETag === etag) {
            return res.status(304).end();
        }

        res.setHeader("Cache-Control", "private, max-age=300, stale-while-revalidate=120");
        res.setHeader("Vary", "Cookie");
        res.setHeader("ETag", etag);
        res.setHeader("Content-Type", "application/json");

        return res.status(200).json(jsonResponse);
    } catch (error) {
        console.info("Error in getPoliciesByValidationStatusController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch policies",
        });
    }
};

export const getPolicyStatsController = async (req, res) => {
    try {
        const filters = {};

        ALLOWED_FILTERS.forEach((field) => {
            const value = req.query[field];
            if (value !== undefined && value !== null && value !== "") {
                filters[field] = String(value).trim();
            }
        });

        Object.entries(req.query).forEach(([key, value]) => {
            if (key.includes("__") && value !== null && String(value).trim() !== "" && !key.endsWith("_search")) {
                filters[key] = String(value).trim();
            }
        });

        const stats = await policyServices().getPolicyStats(filters);

        return res.status(200).json({
            success: true,
            message: "Policy Stats Fetched Successfully",
            data: stats,
        });
    } catch (error) {
        console.info("Error in getPolicyStatsController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch policy stats",
        });
    }
};

export const getPolicyAssetsController = async (req, res) => {
    try {
        const { policyId } = req.params;
        const assets = await policyServices().getPolicyAssets(policyId);

        return res.status(200).json({
            success: true,
            message: "Policy Assets Fetched Successfully",
            data: assets,
        });
    } catch (error) {
        console.info("Error in getPolicyAssetsController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch policy assets",
        });
    }
};

export const getPolicyComplianceController = async (req, res) => {
    try {
        const { policyId } = req.params;
        const compliance = await policyServices().getPolicyCompliance(policyId);

        return res.status(200).json({
            success: true,
            message: "Policy Compliance Fetched Successfully",
            data: compliance,
        });
    } catch (error) {
        console.info("Error in getPolicyComplianceController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch policy compliance",
        });
    }
};

export const exportPoliciesController = async (req, res) => {
    try {
        const doctype = req.query.doctype || "xlsx";

        const filters = {};
        ALLOWED_FILTERS.forEach((field) => {
            const value = req.query[field];
            if (value !== undefined && value !== null && value !== "") {
                filters[field] = String(value).trim();
            }
        });

        Object.entries(req.query).forEach(([key, value]) => {
            if (key.includes("__") && value !== null && String(value).trim() !== "" && !key.endsWith("_search")) {
                filters[key] = String(value).trim();
            }
        });

        const searchFields = {};
        for (const [key, value] of Object.entries(req.query)) {
            if (key.endsWith("_search") && value !== null && String(value).trim() !== "") {
                searchFields[key] = String(value).trim();
            }
        }

        const sort = {};
        if (req.query.sort_by) {
            sort[req.query.sort_by] = req.query.order === "asc" ? "ASC" : "DESC";
        } else {
            sort.created_at = "DESC";
        }

        const labels = {};

        const result = await policyServices().getAllPolicies(filters, {}, searchFields, sort);

        if (doctype === "xlsx") {
            console.log("Generating Excel...");
            const buffer = await exportToExcel(result.policies, labels);
            console.log("Excel buffer size:", buffer.length);
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=policies.xlsx");
            return res.send(buffer);
        } else if (doctype === "pdf") {
            console.log("Generating PDF...");
            try {
                const buffer = await exportToPDFBuffer(result.policies, labels);
                console.log("PDF buffer size:", buffer.length);
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", "attachment; filename=policies.pdf");
                return res.send(buffer);
            } catch (pdfError) {
                console.info("PDF generation error:", pdfError);
                console.info("PDF error stack:", pdfError.stack);
                return res.status(500).json({ error: "PDF generation failed", details: pdfError.message });
            }
        } else {
            return res.status(400).json({ error: "Format must be 'xlsx' or 'pdf'" });
        }
    } catch (error) {
        console.info("Export policies error:", error);
        console.info("Error stack:", error.stack);
        return res.status(500).json({
            error: "Export failed",
            details: error.message,
            stack: error.stack,
        });
    }
};
