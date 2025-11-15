import crypto from "crypto";

import assetServices from "../services/assetServices.js";
import { exportToExcel, exportToPDFBuffer } from "../utils/exporter.js";

const ALLOWED_FILTERS = [
    "tenant_id",
    "provider",
    "region",
    "environment",
    "category",
    "lifecycle_state",
    "health_status",
    "resource_type",
    "resource_id",
];

export const getAllAssetsController = async (req, res) => {
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

        const result = await assetServices().getAllAssets(filters, req.pagination, searchFields, sort);

        const jsonResponse = {
            success: true,
            message: "Assets Fetched Successfully",
            data: result.assets,
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
        console.info("Error in getAllAssetsController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch assets",
        });
    }
};

export const exportAssetsController = async (req, res) => {
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

        const result = await assetServices().getAllAssets(filters, {}, searchFields, sort);

        if (doctype === "xlsx") {
            console.log("Generating Excel...");
            const buffer = await exportToExcel(result.assets, labels);
            console.log("Excel buffer size:", buffer.length);
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=assets.xlsx");
            return res.send(buffer);
        } else if (doctype === "pdf") {
            console.log("Generating PDF...");
            try {
                const buffer = await exportToPDFBuffer(result.assets, labels);
                console.log("PDF buffer size:", buffer.length);
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", "attachment; filename=assets.pdf");
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
        console.info("Export assets error:", error);
        console.info("Error stack:", error.stack);
        return res.status(500).json({
            error: "Export failed",
            details: error.message,
            stack: error.stack,
        });
    }
};
