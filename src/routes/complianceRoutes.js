import express from "express";

import { exportComplianceController, getAllComplianceController } from "../controllers/complianceController.js";
import paginate from "../middlewares/paginate.js";

const router = express.Router();

router.get("/compliance", paginate(), getAllComplianceController);
router.get("/compliance/export", exportComplianceController);

export default router;
