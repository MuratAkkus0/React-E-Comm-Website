import { z } from "zod";

export const emailSchema = z
  .string({ error: "email is required." })
  .trim()
  .toLowerCase()
  .email("must be a valid email address.")
  .max(254, "email must be at most 254 characters.");

export const passwordSchema = z
  .string({ error: "password is required." })
  .min(8, "password must be at least 8 characters.")
  .max(72, "password must be at most 72 characters.");

export const registerSchema = z.object({
  name: z
    .string({ error: "name is required." })
    .trim()
    .min(2, "name must be at least 2 characters.")
    .max(100, "name must be at most 100 characters."),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string({ error: "password is required." })
    .min(1, "password is required.")
    .max(72, "password must be at most 72 characters."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
