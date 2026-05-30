"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const resume_controller_1 = require("../controllers/resume.controller");
const auth_1 = require("../middleware/auth");
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, "uploads"),
    filename: (_req, file, cb) => {
        const extension = path_1.default.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
    },
});
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.post("/", upload.single("resume"), resume_controller_1.createResume);
router.get("/", resume_controller_1.getResumes);
router.get("/:id", resume_controller_1.getResumeById);
router.put("/:id", resume_controller_1.updateResume);
router.delete("/:id", resume_controller_1.deleteResume);
router.get("/:id/analysis", resume_controller_1.analyzeResume);
exports.default = router;
