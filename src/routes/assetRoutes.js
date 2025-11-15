import express from "express";

import { exportAssetsController, getAllAssetsController } from "../controllers/assetController.js";
import paginate from "../middlewares/paginate.js";

const router = express.Router();

router.get("/assets", paginate(), getAllAssetsController);
router.get("/assets/export", exportAssetsController);

export default router;
