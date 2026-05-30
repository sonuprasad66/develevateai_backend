import { Router } from "express";
import {
  analyticsData,
  dashboardSummary,
  skillGapAnalysis,
} from "../controllers/insights.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

router.get("/dashboard-summary", dashboardSummary);
router.post("/skill-gap", skillGapAnalysis);
router.get("/analytics", analyticsData);

export default router;
