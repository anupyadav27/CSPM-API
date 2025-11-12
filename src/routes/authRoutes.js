import express from "express";

import {
    loginController,
    logoutController,
    refreshAccessTokenController,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/refresh", refreshAccessTokenController);

export default router;
