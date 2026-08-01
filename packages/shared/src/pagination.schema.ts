import { z } from "zod";

/**
 * Shared pagination query params, used by every list endpoint (products,
 * orders, reviews). Kept generic and small on purpose: callers add their
 * own filter/sort fields on top with `.extend(...)`.
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  pagination: PaginationMeta;
}
