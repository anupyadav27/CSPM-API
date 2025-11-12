import express from "express";

import {
    samlAcsController,
    samlLoginController,
    samlLogoutCallbackController,
} from "../controllers/samlController.js";

const router = express.Router();

router.get("/login", samlLoginController);

router.post("/acs", samlAcsController);

router.post("/acs/logout", samlLogoutCallbackController);

router.get("/metadata", (req, res) => {
    res.json({ ok: true });
});

//HII ksks

export default router;
