import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string({ error: "name is required." })
    .trim()
    .min(2, "name must be at least 2 characters.")
    .max(80, "name must be at most 80 characters."),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
