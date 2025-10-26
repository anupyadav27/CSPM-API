import express from "express";

import { getAllAssetsController } from "../controllers/assetController.js";
import paginate from "../middleware/paginate.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/assets", authenticateUser, paginate(), getAllAssetsController);

export default router;
