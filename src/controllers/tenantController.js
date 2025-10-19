import tenantServices from "../services/tenantServices.js";

export const getTenantsByUserController = async (req, res) => {
    try {
        const userId = req.userId;
		console.log(`userId : ${userId}`)

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
        console.error("Error in getTenantsByUserController:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch tenants",
            error: error.message,
        });
    }
};
