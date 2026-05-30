"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProjects = exports.deleteProject = exports.updateProject = exports.getProjects = exports.createProject = void 0;
const Project_1 = require("../models/Project");
const ai_service_1 = require("../services/ai.service");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.createProject = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const project = await Project_1.Project.create({
        userId: req.user?.userId,
        ...req.body,
    });
    res.status(201).json((0, apiResponse_1.apiResponse)("Project created", project));
});
exports.getProjects = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const status = req.query.status;
    const search = req.query.search;
    const query = { userId: req.user?.userId };
    if (status)
        query.status = status;
    if (search)
        query.title = { $regex: search, $options: "i" };
    const projects = await Project_1.Project.find(query).sort({ updatedAt: -1 });
    res.json((0, apiResponse_1.apiResponse)("Projects fetched", projects));
});
exports.updateProject = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const project = await Project_1.Project.findOneAndUpdate({ _id: req.params.id, userId: req.user?.userId }, req.body, { new: true });
    if (!project) {
        throw new apiError_1.ApiError(404, "Project not found");
    }
    res.json((0, apiResponse_1.apiResponse)("Project updated", project));
});
exports.deleteProject = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const project = await Project_1.Project.findOneAndDelete({ _id: req.params.id, userId: req.user?.userId });
    if (!project) {
        throw new apiError_1.ApiError(404, "Project not found");
    }
    res.json((0, apiResponse_1.apiResponse)("Project deleted"));
});
exports.generateProjects = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { skills = [], targetRole = "Software Engineer" } = req.body;
    const prompt = `Generate 5 portfolio project ideas for role ${targetRole} with skills ${skills.join(", ")}. Use concise bullet points.`;
    const aiText = await (0, ai_service_1.askAI)(prompt);
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
    res.json((0, apiResponse_1.apiResponse)("AI project suggestions generated", { aiText, ideas: mockIdeas }));
});
