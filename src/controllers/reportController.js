import crypto from "crypto";

import reportServices from "../services/reportServices.js";

export const getAllReportsController = async (req, res) => {
    try {
        const filters = {};

        if (req.query.tenantId) filters.tenantId = req.query.tenantId;

        const result = await reportServices().getAllReports(filters, req.pagination);

        const jsonResponse = {
            success: true,
            message: "Reports Fetched Successfully",
            data: result.reports,
            pagination: result.pagination,
        };

        const etag = crypto.createHash("md5").update(JSON.stringify(result)).digest("hex");

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
        return res.status(500).json({
            success: false,
            message: "Failed to fetch reports",
            error: error.message,
        });
    }
};
