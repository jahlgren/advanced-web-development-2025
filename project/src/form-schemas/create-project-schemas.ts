import z from 'zod';

export const CreateProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  categories: z
    .array(z.string().min(1, 'Category cannot be empty'))
    .min(1, 'At least one category is required')
    .refine((arr) => new Set(arr).size === arr.length, {
      message: "Categories must be unique",
    })
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
