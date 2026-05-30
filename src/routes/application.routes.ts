import { Router } from "express";
import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication,
} from "../controllers/application.controller";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
  createApplicationSchema,
  updateApplicationSchema,
} from "../validations/application.validation";

const router = Router();
router.use(requireAuth);

router.post("/", validateBody(createApplicationSchema), createApplication);
router.get("/", getApplications);
router.put("/:id", validateBody(updateApplicationSchema), updateApplication);
router.delete("/:id", deleteApplication);

export default router;
