import express from "express";

import paginate from "../middleware/paginate.js";
import { getAllPoliciesController } from "../controllers/policyController.js";

const router = express.Router();

router.get("/policies", paginate(), getAllPoliciesController);

export default router;
