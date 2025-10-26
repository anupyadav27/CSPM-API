import crypto from "crypto";

import complianceServices from "../services/complianceServices.js";

export const getAllCompliancesController = async (req, res) => {
    try {
        const filters = {};
        if (req.query.tenantId) filters.tenantId = req.query.tenantId;

        const result = await complianceServices.getAllCompliances(filters, req.pagination);

        const jsonResponse = {
            success: true,
            message: "Compliances Fetched Successfully",
            data: result.compliances,
            pagination: result.pagination,
        };

        const etag = crypto.createHash("md5").update(JSON.stringify(result)).digest("hex");

        const clientEtag = req.headers["if-none-match"];
        if (clientEtag && clientEtag === etag) {
            return res.status(304).end();
        }

        res.setHeader("Cache-Control", "private, max-age=300, stale-while-revalidate=120");
        res.setHeader("Vary", "Cookie");
        res.setHeader("ETag", etag);
        res.setHeader("Content-Type", "application/json");

        return res.status(200).json(jsonResponse);
    } catch (error) {
        console.error("Error in getAllComplianceController:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch compliances",
        });
    }
};
