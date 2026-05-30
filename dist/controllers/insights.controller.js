"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsData = exports.skillGapAnalysis = exports.dashboardSummary = void 0;
const Application_1 = require("../models/Application");
const Project_1 = require("../models/Project");
const Resume_1 = require("../models/Resume");
const ai_service_1 = require("../services/ai.service");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.dashboardSummary = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.userId;
    const [resume, applicationsCount, interviewCount, projectCount] = await Promise.all([
        Resume_1.Resume.findOne({ userId }).sort({ createdAt: -1 }),
        Application_1.Application.countDocuments({ userId }),
        Application_1.Application.countDocuments({ userId, status: "Interview" }),
        Project_1.Project.countDocuments({ userId, status: "completed" }),
    ]);
    res.json((0, apiResponse_1.apiResponse)("Dashboard summary", {
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
    }));
});
exports.skillGapAnalysis = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { targetRole, userSkills } = req.body;
    const prompt = `Analyze skill gap for role ${targetRole} with current skills ${userSkills.join(", ")}. Provide roadmap and certifications.`;
    const aiText = await (0, ai_service_1.askAI)(prompt);
    res.json((0, apiResponse_1.apiResponse)("Skill gap analysis", {
        missingSkills: ["System Design", "Kubernetes", "CI/CD", "Observability"],
        roadmap: [
            "Month 1: System design fundamentals and caching patterns",
            "Month 2: Containerization with Docker + Kubernetes basics",
            "Month 3: Build one production-grade distributed app",
        ],
        certifications: ["AWS Developer Associate", "CKAD"],
        projectRecommendations: ["Build a multi-tenant SaaS billing module"],
        aiText,
    }));
});
exports.analyticsData = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.userId;
    const apps = await Application_1.Application.find({ userId });
    const resumes = await Resume_1.Resume.find({ userId }).sort({ createdAt: 1 });
    const statusBuckets = ["Applied", "Interview", "Rejected", "Offer", "Ghosted"].map((status) => ({
        status,
        count: apps.filter((a) => a.status === status).length,
    }));
    const monthly = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, idx) => ({
        month,
        applications: Math.max(1, Math.floor(apps.length / 6) + idx),
    }));
    const atsTrend = resumes.map((r, i) => ({
        index: i + 1,
        score: r.atsScore,
    }));
    res.json((0, apiResponse_1.apiResponse)("Analytics data", {
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
    }));
});
