import express from "express";

import { getAllThreatsController } from "../controllers/threatController.js";
import paginate from "../middleware/paginate.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/threats", authenticateUser, paginate(), getAllThreatsController);

export default router;
