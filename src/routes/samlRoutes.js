import express from "express";
import fs from "fs";
import {samlAcs, samlLogin} from "../controllers/samlController.js";

const router = express.Router();

const cert = fs.readFileSync(process.env.OKTA_CERT || "./okta.cert", "utf-8");

router.get("/login", samlLogin);

router.post("/acs", samlAcs);

router.get("/metadata", (req, res) => {
	res.json({ok: true});
});

export default router;
