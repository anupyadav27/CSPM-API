import crypto from "crypto";

import assetServices from "../services/assetServices.js";

export const getAllAssetsController = async (req, res) => {
    try {
        const filters = {};
        if (req.query.resourceType) filters.resourceType = req.query.resourceType;
        if (req.query.environment) filters.environment = req.query.environment;
        if (req.query.region) filters.region = req.query.region;

        const result = await assetServices.getAllAssets(filters, req.pagination);

        const jsonResponse = {
            success: true,
            message: "Assets Fetched Successfully",
            data: result.assets,
            pagination: result.pagination,
        };

        const etag = crypto
            .createHash("md5")
            .update(JSON.stringify(jsonResponse.data))
            .digest("hex");

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
        console.error("Error in getAllAssetsController:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch assets",
        });
    }
};
