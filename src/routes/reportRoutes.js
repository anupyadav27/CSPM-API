import express from "express";

import { exportReportsController, getAllReportsController } from "../controllers/reportController.js";

const router = express.Router();

router.get("/reports", getAllReportsController);
router.get("/reports/export", exportReportsController);

export default router;
