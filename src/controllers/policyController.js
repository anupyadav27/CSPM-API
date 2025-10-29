import crypto from "crypto";

import policyServices from "../services/policyServices.js";

export const getAllPoliciesController = async (req, res) => {
    try {
        const filters = {};
        if (req.query.tenantId) filters.tenantId = req.query.tenantId;

        const searchFields = {};
        for (const [key, value] of Object.entries(req.query)) {
            if (key.endsWith("_search") && value.trim() !== "") {
                searchFields[key] = value;
            }
        }

        const sort = {};
        if (req.query.sortBy) {
            const order = req.query.order === "asc" ? 1 : -1;
            sort[req.query.sortBy] = order;
        } else {
            sort.createdAt = -1;
        }

        const result = await policyServices().getAllPolicies(filters, req.pagination, searchFields);

        const jsonResponse = {
            success: true,
            message: "Policies Fetched Successfully",
            data: result.policies,
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
            message: "Failed to fetch policies",
            error: error.message,
        });
    }
};
