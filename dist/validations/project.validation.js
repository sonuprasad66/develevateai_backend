"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectSchema = exports.createProjectSchema = void 0;
const zod_1 = require("zod");
exports.createProjectSchema = zod_1.z.object({
    title: zod_1.z.string().min(2),
    description: zod_1.z.string().min(5),
    status: zod_1.z.enum(["planned", "in-progress", "completed"]).optional(),
    githubUrl: zod_1.z.string().url().optional(),
    liveUrl: zod_1.z.string().url().optional(),
    aiGenerated: zod_1.z.boolean().optional(),
});
exports.updateProjectSchema = exports.createProjectSchema.partial();
