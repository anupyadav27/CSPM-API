import express from "express";
import {authenticateUser} from "../middleware/authMiddleware.js";
import paginate from "../middleware/paginate.js";
import {getTenantsByUserController} from "../controllers/tenantController.js";

const router = express.Router();

router.get("/tenants", authenticateUser, paginate(), getTenantsByUserController);

export default router;