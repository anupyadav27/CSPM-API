import express from "express";

import { authenticateUser } from "../middleware/authMiddleware.js";
import paginate from "../middleware/paginate.js";
import { getAllCompliancesController } from "../controllers/complianceController.js";

const router = express.Router();

router.get("/compliances", authenticateUser, paginate(), getAllCompliancesController);

export default router;
