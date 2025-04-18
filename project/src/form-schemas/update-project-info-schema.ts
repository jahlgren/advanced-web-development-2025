import z from 'zod';

export const UpdateProjectInfoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export type UpdateProjectInfoInput = z.infer<typeof UpdateProjectInfoSchema>;
