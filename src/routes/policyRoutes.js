import express from "express";

import { exportPoliciesController, getAllPoliciesController } from "../controllers/policyController.js";
import paginate from "../middlewares/paginate.js";

const router = express.Router();

router.get("/policies", paginate(), getAllPoliciesController);
router.get("/policies/export", exportPoliciesController);

export default router;
