"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askAI = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const callGemini = async (prompt) => {
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    const response = await axios_1.default.post(`${endpoint}?key=${env_1.env.geminiApiKey}`, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.5 },
    });
    return (response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "AI response unavailable");
};
const callOpenAI = async (prompt) => {
    const response = await axios_1.default.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a precise career assistant for developers." },
            { role: "user", content: prompt },
        ],
        temperature: 0.5,
    }, {
        headers: {
            Authorization: `Bearer ${env_1.env.openAiApiKey}`,
        },
    });
    return response.data?.choices?.[0]?.message?.content || "AI response unavailable";
};
const askAI = async (prompt) => {
    const hasOpenAI = !!env_1.env.openAiApiKey;
    const hasGemini = !!env_1.env.geminiApiKey;
    if (!hasOpenAI && !hasGemini) {
        return "AI keys are not configured. Using fallback suggestions.";
    }
    if (env_1.env.aiProvider === "openai" && hasOpenAI) {
        return callOpenAI(prompt);
    }
    if (hasGemini) {
        return callGemini(prompt);
    }
    return callOpenAI(prompt);
};
exports.askAI = askAI;
