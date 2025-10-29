import express from "express";

import paginate from "../middleware/paginate.js";
import { getAllReportsController } from "../controllers/reportController.js";

const router = express.Router();

router.get("/reports", paginate(), getAllReportsController);

export default router;
