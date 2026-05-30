import { Response } from "express";
import { InterviewNote } from "../models/InterviewNote";
import { askAI } from "../services/ai.service";
import { AuthRequest } from "../types";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const generateInterviewPrep = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { role, experienceLevel, techStack } = req.body as {
    role: string;
    experienceLevel: string;
    techStack: string[];
  };

  const prompt = `Generate interview prep for ${role}, ${experienceLevel}, stack ${techStack.join(
    ", "
  )}. Include technical, behavioral, HR, and coding questions.`;

  const aiText = await askAI(prompt);

  res.json(
    apiResponse("Interview prep generated", {
      technicalQuestions: [
        "Explain event loop internals in Node.js.",
        "How would you design a scalable notification service?",
      ],
      behavioralQuestions: ["Tell me about a conflict you resolved in a team."],
      hrQuestions: ["Why are you interested in this role?"],
      codingChallenges: ["Implement an LRU cache with O(1) operations."],
      aiText,
    })
  );
});

export const saveInterviewNote = asyncHandler(async (req: AuthRequest, res: Response) => {
  const note = await InterviewNote.create({
    userId: req.user?.userId,
    ...req.body,
  });

  res.status(201).json(apiResponse("Interview note saved", note));
});

export const getInterviewNotes = asyncHandler(async (req: AuthRequest, res: Response) => {
  const notes = await InterviewNote.find({ userId: req.user?.userId }).sort({ createdAt: -1 });
  res.json(apiResponse("Interview notes fetched", notes));
});
