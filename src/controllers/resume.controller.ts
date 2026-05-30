import fs from "fs";
import path from "path";
import { Response } from "express";
import { Resume } from "../models/Resume";
import { askAI } from "../services/ai.service";
import { extractTextFromResume } from "../services/resume-parser.service";
import { AuthRequest } from "../types";
import { ApiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const buildAIPrompt = (text: string) => `Analyze this developer resume and return concise advice:\n${text.slice(0, 5000)}`;

export const createResume = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, "Resume file is required");
  }

  const extractedText = await extractTextFromResume(req.file.path);
  const aiText = await askAI(buildAIPrompt(extractedText));
  const aiFeedback = aiText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 8);

  const atsScore = Math.max(45, Math.min(95, 55 + Math.floor(extractedText.length / 450)));

  const resume = await Resume.create({
    userId: req.user?.userId,
    title: req.body.title || path.parse(req.file.originalname).name,
    fileUrl: `/uploads/${path.basename(req.file.path)}`,
    extractedText,
    atsScore,
    aiFeedback,
  });

  res.status(201).json(apiResponse("Resume uploaded", resume));
});

export const getResumes = asyncHandler(async (req: AuthRequest, res: Response) => {
  const resumes = await Resume.find({ userId: req.user?.userId }).sort({ createdAt: -1 });
  res.json(apiResponse("Resumes fetched", resumes));
});

export const getResumeById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user?.userId });
  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }
  res.json(apiResponse("Resume fetched", resume));
});

export const updateResume = asyncHandler(async (req: AuthRequest, res: Response) => {
  const resume = await Resume.findOneAndUpdate(
    { _id: req.params.id, userId: req.user?.userId },
    { title: req.body.title },
    { new: true }
  );

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  res.json(apiResponse("Resume updated", resume));
});

export const deleteResume = asyncHandler(async (req: AuthRequest, res: Response) => {
  const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user?.userId });
  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  const absolutePath = path.join(process.cwd(), resume.fileUrl.replace(/^\//, ""));
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }

  res.json(apiResponse("Resume deleted"));
});

export const analyzeResume = asyncHandler(async (req: AuthRequest, res: Response) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user?.userId });
  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  const aiText = await askAI(
    `Provide JSON-like sections for strengths, weaknesses, missing keywords, improvements for this resume:\n${resume.extractedText.slice(
      0,
      5000
    )}`
  );

  res.json(
    apiResponse("Resume analyzed", {
      atsScore: resume.atsScore,
      strengths: resume.aiFeedback.slice(0, 3),
      weaknesses: resume.aiFeedback.slice(3, 6),
      missingKeywords: ["Distributed Systems", "CI/CD", "Testing"],
      improvements: resume.aiFeedback,
      recruiterReadability: Math.max(60, resume.atsScore - 5),
      rawAI: aiText,
    })
  );
});
