import { z } from "zod";

// The order lifecycle. Illegal transitions are rejected by the service
// layer (apps/api/src/modules/orders/orders.service.ts), never trusted
// from the client.
export const orderStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

export type OrderStatus = z.infer<typeof orderStatusSchema>;

// Checkout never accepts a client-supplied price or total: the server
// recomputes everything from the current DB prices of the items in the
// caller's own cart. This schema intentionally carries no money fields.
export const checkoutSchema = z.object({
  shippingAddress: z
    .string({ error: "shippingAddress is required." })
    .trim()
    .min(10, "shippingAddress must be at least 10 characters.")
    .max(500, "shippingAddress must be at most 500 characters."),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["SHIPPED", "DELIVERED"]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
