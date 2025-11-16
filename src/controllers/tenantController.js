import crypto from "crypto";

import tenantServices from "../services/tenantServices.js";
import { exportToExcel, exportToPDFBuffer } from "../utils/exporter.js";

const ALLOWED_FILTERS = [
    "status",
    "plan",
    "region",
    "billing_payment_status",
    "integration_aws_enabled",
    "integration_slack_enabled",
    "integration_siem_enabled",
    "security_sso_enabled",
];

export const getAllTenantsController = async (req, res) => {
    try {
        const userId = req?.userId;
        const userRoles = req?.user?.roles;
        const hasDeveloperRole = false;
        // if (userRoles) {
        //     hasDeveloperRole = userRoles.some((role) => role.name === "developer");
        // }

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

        const result = !(userRoles && hasDeveloperRole)
            ? await tenantServices().getAllTenants(filters, req.pagination, searchFields, sort)
            : await tenantServices().getAllTenantsByUser(userId, filters, req.pagination, searchFields, sort);

        const jsonResponse = {
            success: true,
            message: "Tenants Fetched Successfully",
            data: result.tenants,
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
        console.info("Error in getAllTenantsController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch tenants",
        });
    }
};

export const exportTenantsController = async (req, res) => {
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

        const result = await tenantServices().getAllTenants(filters, {}, searchFields, sort);

        if (doctype === "xlsx") {
            console.log("Generating Excel...");
            const buffer = await exportToExcel(result.tenants, labels);
            console.log("Excel buffer size:", buffer.length);
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=tenants.xlsx");
            return res.send(buffer);
        } else if (doctype === "pdf") {
            console.log("Generating PDF...");
            try {
                const buffer = await exportToPDFBuffer(result.tenants, labels);
                console.log("PDF buffer size:", buffer.length);
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", "attachment; filename=tenants.pdf");
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
        console.info("Export tenants error:", error);
        console.info("Error stack:", error.stack);
        return res.status(500).json({
            error: "Export failed",
            details: error.message,
            stack: error.stack,
        });
    }
};
