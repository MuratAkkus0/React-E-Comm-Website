import { z } from "zod";
import { paginationQuerySchema } from "./pagination.schema.js";

export const productSortSchema = z
  .enum(["newest", "price_asc", "price_desc", "name_asc", "rating_desc"])
  .default("newest");

export const productQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(200).optional(),
  category: z.string().trim().max(80).optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  sort: productSortSchema,
  // Only honored for admins (see products.controller.ts) — lets the admin
  // product management screen see deactivated products too.
  includeInactive: z.coerce.boolean().default(false),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;

// Deterministic placeholder image derived from the product name: a palette
// color plus the product's initial, rendered as SVG on the client. Colors
// are picked from a small, documented, accessible palette (see
// packages/shared/src/design-tokens.ts).
export const createProductSchema = z.object({
  name: z
    .string({ error: "name is required." })
    .trim()
    .min(2, "name must be at least 2 characters.")
    .max(150, "name must be at most 150 characters."),
  description: z
    .string({ error: "description is required." })
    .trim()
    .min(10, "description must be at least 10 characters.")
    .max(4000, "description must be at most 4000 characters."),
  priceCents: z
    .number({ error: "priceCents is required." })
    .int("priceCents must be an integer number of minor currency units.")
    .positive("priceCents must be greater than zero."),
  currency: z
    .string()
    .trim()
    .length(3, "currency must be an ISO-4217 code, e.g. EUR.")
    .toUpperCase()
    .default("EUR"),
  stock: z
    .number({ error: "stock is required." })
    .int("stock must be an integer.")
    .min(0, "stock cannot be negative."),
  categoryId: z
    .number({ error: "categoryId is required." })
    .int()
    .positive(),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const adjustStockSchema = z.object({
  delta: z
    .number({ error: "delta is required." })
    .int("delta must be an integer.")
    .refine((value) => value !== 0, "delta must not be zero."),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
