import { z } from "zod";

export const UpdateTimeLogSchema = z.object({
  description: z.string().nullable().optional(),
  categoryId: z.string().optional(),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be updated.",
});

export type UpdateTimeLogInput = z.infer<typeof UpdateTimeLogSchema>;