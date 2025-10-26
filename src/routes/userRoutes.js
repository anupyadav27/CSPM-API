import express from "express";

import { getAllUsersController } from "../controllers/userController.js";
import paginate from "../middleware/paginate.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", authenticateUser, paginate(), getAllUsersController);

export default router;
