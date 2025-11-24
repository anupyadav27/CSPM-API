import crypto from "crypto";

import reportServices from "../services/reportServices.js";
import { exportToExcel, exportToPDFBuffer } from "../utils/exporter.js";

const ALLOWED_FILTERS = ["tenant_id", "type", "status", "created_at", "generated_at", "title", "description"];

export const getAllReportsController = async (req, res) => {
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

        const result = await reportServices().getAllReports(filters, req.pagination, searchFields, sort);

        const jsonResponse = {
            success: true,
            message: "Reports Fetched Successfully",
            data: result.reports,
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
        console.info("Error in getAllReportsController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch reports",
        });
    }
};

export const getReportByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await reportServices().getReportById(id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Report fetched successfully",
            data: report,
        });
    } catch (error) {
        console.info("Error in getReportByIdController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch report",
        });
    }
};

export const createReportController = async (req, res) => {
    try {
        const report = await reportServices().createReport(req.body, req.user?.id);

        return res.status(201).json({
            success: true,
            message: "Report created successfully",
            data: report,
        });
    } catch (error) {
        console.info("Error in createReportController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create report",
        });
    }
};

export const updateReportController = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await reportServices().updateReport(id, req.body, req.user?.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Report updated successfully",
            data: report,
        });
    } catch (error) {
        console.info("Error in updateReportController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update report",
        });
    }
};

export const deleteReportController = async (req, res) => {
    try {
        const { id } = req.params;
        await reportServices().deleteReport(id, req.user?.id);

        return res.status(200).json({
            success: true,
            message: "Report deleted successfully",
        });
    } catch (error) {
        console.info("Error in deleteReportController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete report",
        });
    }
};

export const getReportsByTenantController = async (req, res) => {
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

        const result = await reportServices().getReportsByTenant(tenantId, filters, req.pagination, searchFields, sort);

        const jsonResponse = {
            success: true,
            message: "Reports Fetched Successfully",
            data: result.reports,
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
        console.info("Error in getReportsByTenantController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch reports",
        });
    }
};

export const getReportsByTypeController = async (req, res) => {
    try {
        const { type } = req.params;

        const filters = {};

        ALLOWED_FILTERS.forEach((field) => {
            if (field !== "type") {
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

        const result = await reportServices().getReportsByType(type, filters, req.pagination, searchFields, sort);

        const jsonResponse = {
            success: true,
            message: "Reports Fetched Successfully",
            data: result.reports,
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
        console.info("Error in getReportsByTypeController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch reports",
        });
    }
};

export const getReportsByStatusController = async (req, res) => {
    try {
        const { status } = req.params;

        const filters = {};

        ALLOWED_FILTERS.forEach((field) => {
            if (field !== "status") {
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

        const result = await reportServices().getReportsByStatus(status, filters, req.pagination, searchFields, sort);

        const jsonResponse = {
            success: true,
            message: "Reports Fetched Successfully",
            data: result.reports,
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
        console.info("Error in getReportsByStatusController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch reports",
        });
    }
};

export const getReportStatsController = async (req, res) => {
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

        const stats = await reportServices().getReportStats(filters);

        return res.status(200).json({
            success: true,
            message: "Report Stats Fetched Successfully",
            data: stats,
        });
    } catch (error) {
        console.info("Error in getReportStatsController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch report stats",
        });
    }
};

export const getReportAssetsController = async (req, res) => {
    try {
        const { reportId } = req.params;
        const assets = await reportServices().getReportAssets(reportId);

        return res.status(200).json({
            success: true,
            message: "Report Assets Fetched Successfully",
            data: assets,
        });
    } catch (error) {
        console.info("Error in getReportAssetsController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch report assets",
        });
    }
};

export const getReportComplianceController = async (req, res) => {
    try {
        const { reportId } = req.params;
        const compliance = await reportServices().getReportCompliance(reportId);

        return res.status(200).json({
            success: true,
            message: "Report Compliance Fetched Successfully",
            data: compliance,
        });
    } catch (error) {
        console.info("Error in getReportComplianceController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch report compliance",
        });
    }
};

export const getReportPoliciesController = async (req, res) => {
    try {
        const { reportId } = req.params;
        const policies = await reportServices().getReportPolicies(reportId);

        return res.status(200).json({
            success: true,
            message: "Report Policies Fetched Successfully",
            data: policies,
        });
    } catch (error) {
        console.info("Error in getReportPoliciesController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch report policies",
        });
    }
};

export const exportReportsController = async (req, res) => {
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

        const result = await reportServices().getAllReports(filters, {}, searchFields, sort);

        if (doctype === "xlsx") {
            console.log("Generating Excel...");
            const buffer = await exportToExcel(result.reports, labels);
            console.log("Excel buffer size:", buffer.length);
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=reports.xlsx");
            return res.send(buffer);
        } else if (doctype === "pdf") {
            console.log("Generating PDF...");
            try {
                const buffer = await exportToPDFBuffer(result.reports, labels);
                console.log("PDF buffer size:", buffer.length);
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", "attachment; filename=reports.pdf");
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
        console.info("Export reports error:", error);
        console.info("Error stack:", error.stack);
        return res.status(500).json({
            error: "Export failed",
            details: error.message,
            stack: error.stack,
        });
    }
};
