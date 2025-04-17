import z from 'zod';

export const CreateTimelogSchema = z.object({
  categoryId: z.string({message: 'Category is required'}).min(1, 'Category is required'),
  description: z.string().nullable().optional(),
  start: z.string().datetime().nullable().optional(),
  end: z.string().datetime().nullable().optional()
});

export type CreateTimelogInput = z.infer<typeof CreateTimelogSchema>;