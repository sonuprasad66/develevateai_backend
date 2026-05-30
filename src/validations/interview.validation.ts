import { z } from "zod";

export const saveInterviewNoteSchema = z.object({
  question: z.string().min(5),
  answer: z.string().optional(),
  feedback: z.string().optional(),
});

export const generateInterviewSchema = z.object({
  role: z.string().min(2),
  experienceLevel: z.string().min(2),
  techStack: z.array(z.string()).default([]),
});
