import { Router } from "express";
import multer from "multer";
import path from "path";
import {
  analyzeResume,
  createResume,
  deleteResume,
  getResumeById,
  getResumes,
  updateResume,
} from "../controllers/resume.controller";
import { requireAuth } from "../middleware/auth";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads"),
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

const upload = multer({ storage });

const router = Router();
router.use(requireAuth);

router.post("/", upload.single("resume"), createResume);
router.get("/", getResumes);
router.get("/:id", getResumeById);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);
router.get("/:id/analysis", analyzeResume);

export default router;
