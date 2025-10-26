import express from "express";

import paginate from "../middleware/paginate.js";
import { getAllSecOpsController } from "../controllers/secOpsController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/secops", authenticateUser, paginate(), getAllSecOpsController);

export default router;
