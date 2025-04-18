import z from 'zod';

export const UpdateCategorySchema = z.object({
  name: z.string().min(1, "Name is required")
});

export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
