import express from "express";

import paginate from "../middleware/paginate.js";
import { getAllNotificationsController } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/notifications", paginate(), getAllNotificationsController);

export default router;
