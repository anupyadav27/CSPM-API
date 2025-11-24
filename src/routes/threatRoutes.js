import express from "express";

import { exportThreatsController, getAllThreatsController } from "../controllers/threatController.js";
import paginate from "../middlewares/paginate.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/threats", authenticateUser, paginate(), getAllThreatsController);
router.get("/threats/export", exportThreatsController);

export default router;
