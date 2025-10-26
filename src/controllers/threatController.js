import crypto from "crypto";

import threatServices from "../services/threatServices.js";

export const getAllThreatsController = async (req, res) => {
    try {
        const filters = {};

        if (req.query.tenantId) filters.tenantId = req.query.tenantId;

        const result = await threatServices().getAllThreats(filters, req.pagination);

        const jsonResponse = {
            success: true,
            message: "Threats Fetched Successfully",
            data: result.threats,
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
            message: "Failed to fetch threats",
            error: error.message,
        });
    }
};
