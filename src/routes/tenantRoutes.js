import express from "express";

import { exportTenantsController, getAllTenantsController } from "../controllers/tenantController.js";
import paginate from "../middlewares/paginate.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/tenants", authenticateUser, paginate(), getAllTenantsController);
router.get("/tenants/export", exportTenantsController);

export default router;
