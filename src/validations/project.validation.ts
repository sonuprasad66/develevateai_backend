import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  status: z.enum(["planned", "in-progress", "completed"]).optional(),
  githubUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  aiGenerated: z.boolean().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();
