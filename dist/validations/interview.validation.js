"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInterviewSchema = exports.saveInterviewNoteSchema = void 0;
const zod_1 = require("zod");
exports.saveInterviewNoteSchema = zod_1.z.object({
    question: zod_1.z.string().min(5),
    answer: zod_1.z.string().optional(),
    feedback: zod_1.z.string().optional(),
});
exports.generateInterviewSchema = zod_1.z.object({
    role: zod_1.z.string().min(2),
    experienceLevel: zod_1.z.string().min(2),
    techStack: zod_1.z.array(zod_1.z.string()).default([]),
});
