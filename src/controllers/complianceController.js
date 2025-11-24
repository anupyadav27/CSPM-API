import crypto from "crypto";

import complianceServices from "../services/complianceServices.js";
import { exportToExcel, exportToPDFBuffer } from "../utils/exporter.js";

const ALLOWED_FILTERS = ["tenant_id", "framework", "control_id", "status", "severity", "created_at", "last_checked_at"];

export const getAllComplianceController = async (req, res) => {
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

        const result = await complianceServices().getAllCompliance(filters, req.pagination, searchFields, sort);

        const jsonResponse = {
            success: true,
            message: "Compliance Items Fetched Successfully",
            data: result.complianceItems,
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
        console.info("Error in getAllComplianceController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch compliance items",
        });
    }
};

export const getComplianceByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const compliance = await complianceServices().getComplianceById(id);

        if (!compliance) {
            return res.status(404).json({
                success: false,
                message: "Compliance item not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Compliance item fetched successfully",
            data: compliance,
        });
    } catch (error) {
        console.info("Error in getComplianceByIdController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch compliance item",
        });
    }
};

export const createComplianceController = async (req, res) => {
    try {
        const compliance = await complianceServices().createCompliance(req.body, req.user?.id);

        return res.status(201).json({
            success: true,
            message: "Compliance item created successfully",
            data: compliance,
        });
    } catch (error) {
        console.info("Error in createComplianceController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create compliance item",
        });
    }
};

export const updateComplianceController = async (req, res) => {
    try {
        const { id } = req.params;
        const compliance = await complianceServices().updateCompliance(id, req.body, req.user?.id);

        if (!compliance) {
            return res.status(404).json({
                success: false,
                message: "Compliance item not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Compliance item updated successfully",
            data: compliance,
        });
    } catch (error) {
        console.info("Error in updateComplianceController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update compliance item",
        });
    }
};

export const deleteComplianceController = async (req, res) => {
    try {
        const { id } = req.params;
        await complianceServices().deleteCompliance(id, req.user?.id);

        return res.status(200).json({
            success: true,
            message: "Compliance item deleted successfully",
        });
    } catch (error) {
        console.info("Error in deleteComplianceController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete compliance item",
        });
    }
};

export const getComplianceByTenantController = async (req, res) => {
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

        const result = await complianceServices().getComplianceByTenant(tenantId, filters, req.pagination, searchFields, sort);

        const jsonResponse = {
            success: true,
            message: "Compliance Items Fetched Successfully",
            data: result.complianceItems,
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
        console.info("Error in getComplianceByTenantController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch compliance items",
        });
    }
};

export const getComplianceByFrameworkController = async (req, res) => {
    try {
        const { framework } = req.params;

        const filters = {};

        ALLOWED_FILTERS.forEach((field) => {
            if (field !== "framework") {
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

        const result = await complianceServices().getComplianceByFramework(framework, filters, req.pagination, searchFields, sort);

        const jsonResponse = {
            success: true,
            message: "Compliance Items Fetched Successfully",
            data: result.complianceItems,
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
        console.info("Error in getComplianceByFrameworkController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch compliance items",
        });
    }
};

export const getComplianceStatsController = async (req, res) => {
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

        const stats = await complianceServices().getComplianceStats(filters);

        return res.status(200).json({
            success: true,
            message: "Compliance Stats Fetched Successfully",
            data: stats,
        });
    } catch (error) {
        console.info("Error in getComplianceStatsController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch compliance stats",
        });
    }
};

export const getComplianceRemediationStepsController = async (req, res) => {
    try {
        const { complianceId } = req.params;
        const steps = await complianceServices().getComplianceRemediationSteps(complianceId);

        return res.status(200).json({
            success: true,
            message: "Compliance Remediation Steps Fetched Successfully",
            data: steps,
        });
    } catch (error) {
        console.info("Error in getComplianceRemediationStepsController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch compliance remediation steps",
        });
    }
};

export const exportComplianceController = async (req, res) => {
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

        const result = await complianceServices().getAllCompliance(filters, {}, searchFields, sort);

        if (doctype === "xlsx") {
            console.log("Generating Excel...");
            const buffer = await exportToExcel(result.complianceItems, labels);
            console.log("Excel buffer size:", buffer.length);
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=compliance.xlsx");
            return res.send(buffer);
        } else if (doctype === "pdf") {
            console.log("Generating PDF...");
            try {
                const buffer = await exportToPDFBuffer(result.complianceItems, labels);
                console.log("PDF buffer size:", buffer.length);
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", "attachment; filename=compliance.pdf");
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
        console.info("Export compliance error:", error);
        console.info("Error stack:", error.stack);
        return res.status(500).json({
            error: "Export failed",
            details: error.message,
            stack: error.stack,
        });
    }
};
