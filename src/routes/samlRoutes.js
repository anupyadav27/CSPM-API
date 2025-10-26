import express from "express";

import { samlAcs, samlLogin } from "../controllers/samlController.js";

const router = express.Router();

router.get("/login", samlLogin);

router.post("/acs", samlAcs);

router.get("/metadata", (req, res) => {
    res.json({ ok: true });
});

export default router;
