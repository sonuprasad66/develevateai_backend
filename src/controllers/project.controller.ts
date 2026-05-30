import { Response } from "express";
import { Project } from "../models/Project";
import { askAI } from "../services/ai.service";
import { AuthRequest } from "../types";
import { ApiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const createProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const project = await Project.create({
    userId: req.user?.userId,
    ...req.body,
  });

  res.status(201).json(apiResponse("Project created", project));
});

export const getProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  const status = req.query.status as string | undefined;
  const search = req.query.search as string | undefined;

  const query: Record<string, unknown> = { userId: req.user?.userId };
  if (status) query.status = status;
  if (search) query.title = { $regex: search, $options: "i" };

  const projects = await Project.find(query).sort({ updatedAt: -1 });
  res.json(apiResponse("Projects fetched", projects));
});

export const updateProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, userId: req.user?.userId },
    req.body,
    { new: true }
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  res.json(apiResponse("Project updated", project));
});

export const deleteProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user?.userId });
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  res.json(apiResponse("Project deleted"));
});

export const generateProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { skills = [], targetRole = "Software Engineer" } = req.body as {
    skills?: string[];
    targetRole?: string;
  };

  const prompt = `Generate 5 portfolio project ideas for role ${targetRole} with skills ${skills.join(
    ", "
  )}. Use concise bullet points.`;

  const aiText = await askAI(prompt);

  const mockIdeas = [
    {
      title: "Realtime Code Review Copilot",
      description: "AI-assisted PR quality analyzer with lint and risk insights.",
      aiGenerated: true,
      status: "planned",
    },
    {
      title: "Cloud Cost Optimizer Dashboard",
      description: "Tracks infra spend and gives anomaly alerts and optimization tips.",
      aiGenerated: true,
      status: "planned",
    },
  ];

  res.json(apiResponse("AI project suggestions generated", { aiText, ideas: mockIdeas }));
});
