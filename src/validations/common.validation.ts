import { z } from "zod";

export const objectIdSchema = z.object({
  id: z.string().length(24, "Invalid id format"),
});
