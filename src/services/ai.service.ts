import axios from "axios";
import { env } from "../config/env";

const callGemini = async (prompt: string): Promise<string> => {
  const endpoint =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

  const response = await axios.post(
    `${endpoint}?key=${env.geminiApiKey}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.5 },
    }
  );

  return (
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "AI response unavailable"
  );
};

const callOpenAI = async (prompt: string): Promise<string> => {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a precise career assistant for developers." },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
    },
    {
      headers: {
        Authorization: `Bearer ${env.openAiApiKey}`,
      },
    }
  );

  return response.data?.choices?.[0]?.message?.content || "AI response unavailable";
};

export const askAI = async (prompt: string): Promise<string> => {
  const hasOpenAI = !!env.openAiApiKey;
  const hasGemini = !!env.geminiApiKey;

  if (!hasOpenAI && !hasGemini) {
    return "AI keys are not configured. Using fallback suggestions.";
  }

  if (env.aiProvider === "openai" && hasOpenAI) {
    return callOpenAI(prompt);
  }

  if (hasGemini) {
    return callGemini(prompt);
  }

  return callOpenAI(prompt);
};
