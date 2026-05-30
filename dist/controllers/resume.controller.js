"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeResume = exports.deleteResume = exports.updateResume = exports.getResumeById = exports.getResumes = exports.createResume = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Resume_1 = require("../models/Resume");
const ai_service_1 = require("../services/ai.service");
const resume_parser_service_1 = require("../services/resume-parser.service");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const buildAIPrompt = (text) => `Analyze this developer resume and return concise advice:\n${text.slice(0, 5000)}`;
exports.createResume = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        throw new apiError_1.ApiError(400, "Resume file is required");
    }
    const extractedText = await (0, resume_parser_service_1.extractTextFromResume)(req.file.path);
    const aiText = await (0, ai_service_1.askAI)(buildAIPrompt(extractedText));
    const aiFeedback = aiText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 8);
    const atsScore = Math.max(45, Math.min(95, 55 + Math.floor(extractedText.length / 450)));
    const resume = await Resume_1.Resume.create({
        userId: req.user?.userId,
        title: req.body.title || path_1.default.parse(req.file.originalname).name,
        fileUrl: `/uploads/${path_1.default.basename(req.file.path)}`,
        extractedText,
        atsScore,
        aiFeedback,
    });
    res.status(201).json((0, apiResponse_1.apiResponse)("Resume uploaded", resume));
});
exports.getResumes = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const resumes = await Resume_1.Resume.find({ userId: req.user?.userId }).sort({ createdAt: -1 });
    res.json((0, apiResponse_1.apiResponse)("Resumes fetched", resumes));
});
exports.getResumeById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const resume = await Resume_1.Resume.findOne({ _id: req.params.id, userId: req.user?.userId });
    if (!resume) {
        throw new apiError_1.ApiError(404, "Resume not found");
    }
    res.json((0, apiResponse_1.apiResponse)("Resume fetched", resume));
});
exports.updateResume = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const resume = await Resume_1.Resume.findOneAndUpdate({ _id: req.params.id, userId: req.user?.userId }, { title: req.body.title }, { new: true });
    if (!resume) {
        throw new apiError_1.ApiError(404, "Resume not found");
    }
    res.json((0, apiResponse_1.apiResponse)("Resume updated", resume));
});
exports.deleteResume = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const resume = await Resume_1.Resume.findOneAndDelete({ _id: req.params.id, userId: req.user?.userId });
    if (!resume) {
        throw new apiError_1.ApiError(404, "Resume not found");
    }
    const absolutePath = path_1.default.join(process.cwd(), resume.fileUrl.replace(/^\//, ""));
    if (fs_1.default.existsSync(absolutePath)) {
        fs_1.default.unlinkSync(absolutePath);
    }
    res.json((0, apiResponse_1.apiResponse)("Resume deleted"));
});
exports.analyzeResume = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const resume = await Resume_1.Resume.findOne({ _id: req.params.id, userId: req.user?.userId });
    if (!resume) {
        throw new apiError_1.ApiError(404, "Resume not found");
    }
    const aiText = await (0, ai_service_1.askAI)(`Provide JSON-like sections for strengths, weaknesses, missing keywords, improvements for this resume:\n${resume.extractedText.slice(0, 5000)}`);
    res.json((0, apiResponse_1.apiResponse)("Resume analyzed", {
        atsScore: resume.atsScore,
        strengths: resume.aiFeedback.slice(0, 3),
        weaknesses: resume.aiFeedback.slice(3, 6),
        missingKeywords: ["Distributed Systems", "CI/CD", "Testing"],
        improvements: resume.aiFeedback,
        recruiterReadability: Math.max(60, resume.atsScore - 5),
        rawAI: aiText,
    }));
});
