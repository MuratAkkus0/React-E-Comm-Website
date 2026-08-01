import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z
    .number({ error: "rating is required." })
    .int("rating must be an integer.")
    .min(1, "rating must be between 1 and 5.")
    .max(5, "rating must be between 1 and 5."),
  comment: z
    .string({ error: "comment is required." })
    .trim()
    .min(3, "comment must be at least 3 characters.")
    .max(2000, "comment must be at most 2000 characters."),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
