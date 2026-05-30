import { Router } from "express";
import {
  createProject,
  deleteProject,
  generateProjects,
  getProjects,
  updateProject,
} from "../controllers/project.controller";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { createProjectSchema, updateProjectSchema } from "../validations/project.validation";

const router = Router();
router.use(requireAuth);

router.post("/", validateBody(createProjectSchema), createProject);
router.get("/", getProjects);
router.post("/generate", generateProjects);
router.put("/:id", validateBody(updateProjectSchema), updateProject);
router.delete("/:id", deleteProject);

export default router;
