import { z } from "zod";

export const cartItemInputSchema = z.object({
  productId: z.number({ error: "productId is required." }).int().positive(),
  quantity: z
    .number({ error: "quantity is required." })
    .int("quantity must be an integer.")
    .min(1, "quantity must be at least 1.")
    .max(99, "quantity must be at most 99."),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .number({ error: "quantity is required." })
    .int("quantity must be an integer.")
    .min(0, "quantity cannot be negative.")
    .max(99, "quantity must be at most 99."),
});

// Sent once at login to fold the anonymous localStorage cart into the
// user's persistent server-side cart.
export const mergeCartSchema = z.object({
  items: z.array(cartItemInputSchema).max(200),
});

export type CartItemInput = z.infer<typeof cartItemInputSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type MergeCartInput = z.infer<typeof mergeCartSchema>;
