"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationSchema = exports.createApplicationSchema = void 0;
const zod_1 = require("zod");
exports.createApplicationSchema = zod_1.z.object({
    company: zod_1.z.string().min(1),
    role: zod_1.z.string().min(1),
    salary: zod_1.z.number().optional(),
    status: zod_1.z.enum(["Applied", "Interview", "Rejected", "Offer", "Ghosted"]).optional(),
    appliedDate: zod_1.z.string().optional(),
    jobUrl: zod_1.z.string().url().optional(),
    notes: zod_1.z.string().optional(),
});
exports.updateApplicationSchema = exports.createApplicationSchema.partial();
