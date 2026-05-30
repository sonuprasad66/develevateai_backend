"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT || 5000),
    clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
    mongoUri: process.env.MONGODB_URI || "",
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",
    geminiApiKey: process.env.GEMINI_API_KEY || "",
    openAiApiKey: process.env.OPENAI_API_KEY || "",
    aiProvider: process.env.AI_PROVIDER || "gemini",
};
if (!exports.env.mongoUri) {
    console.warn("[env] MONGODB_URI missing. APIs needing DB will fail until set.");
}
