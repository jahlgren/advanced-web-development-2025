import z from 'zod';

export const CreateCategoriesSchema = z.object({
  categories: z
    .array(z.string().min(1, 'Categories cannot be empty'))
    .min(1, 'At least one category is required')
    .refine((arr) => new Set(arr).size === arr.length, {
      message: "Categories must be unique",
    })
});

export type CreateCategoriesInput = z.infer<typeof CreateCategoriesSchema>;
