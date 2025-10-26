import crypto from "crypto";

import tenantServices from "../services/tenantServices.js";

export const getTenantsByUserController = async (req, res) => {
    try {
        const userId = req.userId;

        const filters = { ...req.query };
        delete filters.page;
        delete filters.pageSize;

        const result = await tenantServices.getTenantsByUserId(userId);

        return res.status(200).json({
            success: true,
            message: "Tenants fetched successfully",
            data: result.tenants,
            pagination: result.pagination,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch tenants",
            error: error.message,
        });
    }
};

export const getAllTenantsController = async (req, res) => {
    try {
        const rawfilters = { ...req.query };
        delete rawfilters.page;
        delete rawfilters.pageSize;
        const filters = {};

        if (rawfilters?.userId) filters.userId = rawfilters?.userId;
        const result = await tenantServices.getAllTenants(filters, req.pagination);

        const jsonResponse = {
            success: true,
            message: "Tenants Fetched Successfully",
            data: result.tenants,
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
        return res.status(500).json({
            success: false,
            message: "Failed to fetch tenants",
            error: error.message,
        });
    }
};
