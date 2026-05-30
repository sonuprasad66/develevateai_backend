import { z } from "zod";

export const createApplicationSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  salary: z.number().optional(),
  status: z.enum(["Applied", "Interview", "Rejected", "Offer", "Ghosted"]).optional(),
  appliedDate: z.string().optional(),
  jobUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

export const updateApplicationSchema = createApplicationSchema.partial();
