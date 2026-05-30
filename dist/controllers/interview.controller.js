"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterviewNotes = exports.saveInterviewNote = exports.generateInterviewPrep = void 0;
const InterviewNote_1 = require("../models/InterviewNote");
const ai_service_1 = require("../services/ai.service");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.generateInterviewPrep = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { role, experienceLevel, techStack } = req.body;
    const prompt = `Generate interview prep for ${role}, ${experienceLevel}, stack ${techStack.join(", ")}. Include technical, behavioral, HR, and coding questions.`;
    const aiText = await (0, ai_service_1.askAI)(prompt);
    res.json((0, apiResponse_1.apiResponse)("Interview prep generated", {
        technicalQuestions: [
            "Explain event loop internals in Node.js.",
            "How would you design a scalable notification service?",
        ],
        behavioralQuestions: ["Tell me about a conflict you resolved in a team."],
        hrQuestions: ["Why are you interested in this role?"],
        codingChallenges: ["Implement an LRU cache with O(1) operations."],
        aiText,
    }));
});
exports.saveInterviewNote = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const note = await InterviewNote_1.InterviewNote.create({
        userId: req.user?.userId,
        ...req.body,
    });
    res.status(201).json((0, apiResponse_1.apiResponse)("Interview note saved", note));
});
exports.getInterviewNotes = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const notes = await InterviewNote_1.InterviewNote.find({ userId: req.user?.userId }).sort({ createdAt: -1 });
    res.json((0, apiResponse_1.apiResponse)("Interview notes fetched", notes));
});
