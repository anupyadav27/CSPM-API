import express from "express";

import { testController } from "../controllers/testController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/test", authenticateUser, testController);

export default router;
