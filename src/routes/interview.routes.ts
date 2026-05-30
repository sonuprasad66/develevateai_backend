import { Router } from "express";
import {
  generateInterviewPrep,
  getInterviewNotes,
  saveInterviewNote,
} from "../controllers/interview.controller";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
  generateInterviewSchema,
  saveInterviewNoteSchema,
} from "../validations/interview.validation";

const router = Router();
router.use(requireAuth);

router.post("/generate", validateBody(generateInterviewSchema), generateInterviewPrep);
router.post("/notes", validateBody(saveInterviewNoteSchema), saveInterviewNote);
router.get("/notes", getInterviewNotes);

export default router;
