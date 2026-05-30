import { Response } from "express";
import { Application } from "../models/Application";
import { Project } from "../models/Project";
import { Resume } from "../models/Resume";
import { askAI } from "../services/ai.service";
import { AuthRequest } from "../types";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const dashboardSummary = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  const [resume, applicationsCount, interviewCount, projectCount] = await Promise.all([
    Resume.findOne({ userId }).sort({ createdAt: -1 }),
    Application.countDocuments({ userId }),
    Application.countDocuments({ userId, status: "Interview" }),
    Project.countDocuments({ userId, status: "completed" }),
  ]);

  res.json(
    apiResponse("Dashboard summary", {
      resumeAtsScore: resume?.atsScore || 68,
      applicationsCount,
      interviewReadiness: Math.min(100, 45 + interviewCount * 10),
      skillGapPercentage: Math.max(10, 70 - projectCount * 8),
      aiRecommendations: [
        "Add quantifiable impact metrics in your latest experience.",
        "Build one cloud-native project with observability.",
      ],
      recentActivity: [
        "Updated resume for Backend Engineer role",
        "Applied to 3 new positions this week",
      ],
    })
  );
});

export const skillGapAnalysis = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { targetRole, userSkills } = req.body as { targetRole: string; userSkills: string[] };

  const prompt = `Analyze skill gap for role ${targetRole} with current skills ${userSkills.join(
    ", "
  )}. Provide roadmap and certifications.`;
  const aiText = await askAI(prompt);

  res.json(
    apiResponse("Skill gap analysis", {
      missingSkills: ["System Design", "Kubernetes", "CI/CD", "Observability"],
      roadmap: [
        "Month 1: System design fundamentals and caching patterns",
        "Month 2: Containerization with Docker + Kubernetes basics",
        "Month 3: Build one production-grade distributed app",
      ],
      certifications: ["AWS Developer Associate", "CKAD"],
      projectRecommendations: ["Build a multi-tenant SaaS billing module"],
      aiText,
    })
  );
});

export const analyticsData = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const apps = await Application.find({ userId });
  const resumes = await Resume.find({ userId }).sort({ createdAt: 1 });

  const statusBuckets = ["Applied", "Interview", "Rejected", "Offer", "Ghosted"].map(
    (status) => ({
      status,
      count: apps.filter((a) => a.status === status).length,
    })
  );

  const monthly = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, idx) => ({
    month,
    applications: Math.max(1, Math.floor(apps.length / 6) + idx),
  }));

  const atsTrend = resumes.map((r, i) => ({
    index: i + 1,
    score: r.atsScore,
  }));

  res.json(
    apiResponse("Analytics data", {
      applicationsPerMonth: monthly,
      atsScoreTrend: atsTrend.length ? atsTrend : [{ index: 1, score: 68 }],
      skillProgress: [
        { skill: "DSA", progress: 72 },
        { skill: "System Design", progress: 56 },
        { skill: "Cloud", progress: 48 },
      ],
      interviewReadiness: [
        { area: "Technical", score: 70 },
        { area: "Behavioral", score: 76 },
        { area: "Communication", score: 64 },
      ],
      projectCompletion: [
        { status: "completed", count: 2 },
        { status: "in-progress", count: 3 },
        { status: "planned", count: 4 },
      ],
      applicationStatuses: statusBuckets,
    })
  );
});
