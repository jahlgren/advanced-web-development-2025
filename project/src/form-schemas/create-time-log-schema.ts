import z from 'zod';

export const CreateTimeLogSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().nullable().optional(),
  start: z.string().datetime('Invalid start time'),
  end: z.string().datetime().nullable().optional()
});

export type CreateTimeLogInput = z.infer<typeof CreateTimeLogSchema>;