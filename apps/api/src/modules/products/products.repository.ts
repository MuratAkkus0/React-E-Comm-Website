import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

type DbClient = PrismaClient | Prisma.TransactionClient;

export interface ProductFilter {
  search?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  activeOnly: boolean;
}

const SORT_MAP = {
  newest: { createdAt: "desc" },
  price_asc: { priceCents: "asc" },
  price_desc: { priceCents: "desc" },
  name_asc: { name: "asc" },
  rating_desc: { ratingAvg: "desc" },
} as const satisfies Record<string, Prisma.ProductOrderByWithRelationInput>;

export type ProductSort = keyof typeof SORT_MAP;

function buildWhere(filter: ProductFilter): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  if (filter.activeOnly) {
    where.isActive = true;
  }
  if (filter.categorySlug) {
    where.category = { slug: filter.categorySlug };
  }
  if (filter.search) {
    where.OR = [
      { name: { contains: filter.search, mode: "insensitive" } },
      { description: { contains: filter.search, mode: "insensitive" } },
    ];
  }
  if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
    where.priceCents = {
      ...(filter.minPrice !== undefined ? { gte: filter.minPrice } : {}),
      ...(filter.maxPrice !== undefined ? { lte: filter.maxPrice } : {}),
    };
  }

  return where;
}

export async function findMany(
  filter: ProductFilter,
  sort: ProductSort,
  skip: number,
  take: number,
) {
  const where = buildWhere(filter);

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: SORT_MAP[sort],
      skip,
      take,
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total };
}

export function findById(id: number) {
  return prisma.product.findUnique({ where: { id }, include: { category: true } });
}

export function findBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug }, include: { category: true } });
}

export function findBySlugBase(slugBase: string) {
  return prisma.product.findMany({
    where: { slug: { startsWith: slugBase } },
    select: { slug: true },
  });
}

export function create(data: Prisma.ProductCreateInput) {
  return prisma.product.create({ data, include: { category: true } });
}

export function update(id: number, data: Prisma.ProductUpdateInput) {
  return prisma.product.update({ where: { id }, data, include: { category: true } });
}

export function remove(id: number) {
  return prisma.product.delete({ where: { id } });
}

export function countOrderItemsForProduct(productId: number) {
  return prisma.orderItem.count({ where: { productId } });
}

/**
 * Atomically applies a stock delta, guarded so it can never go negative.
 * The WHERE clause is re-evaluated by Postgres against the latest
 * committed row under the row lock acquired by this UPDATE, so concurrent
 * callers racing on the same row are safely serialized — this is what
 * prevents overselling without needing a SERIALIZABLE transaction.
 */
export async function applyStockDelta(db: DbClient, productId: number, delta: number) {
  if (delta < 0) {
    const result = await db.product.updateMany({
      where: { id: productId, stock: { gte: -delta } },
      data: { stock: { increment: delta } },
    });
    return result.count === 1;
  }
  const result = await db.product.updateMany({
    where: { id: productId },
    data: { stock: { increment: delta } },
  });
  return result.count === 1;
}
