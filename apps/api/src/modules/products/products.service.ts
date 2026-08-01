import type {
  AdjustStockInput,
  CreateProductInput,
  ProductQuery,
  UpdateProductInput,
  Paginated,
} from "@ecomm/shared";
import { prisma } from "../../lib/prisma.js";
import { BadRequestError, ConflictError, NotFoundError } from "../../lib/errors.js";
import * as productsRepository from "./products.repository.js";
import * as categoriesRepository from "../categories/categories.repository.js";

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueSlug(name: string): Promise<string> {
  const base = slugify(name);
  const existing = await productsRepository.findBySlugBase(base);
  const taken = new Set(existing.map((row) => row.slug));
  if (!taken.has(base)) return base;
  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

export async function listProducts(
  query: ProductQuery,
  canSeeInactive: boolean,
): Promise<Paginated<unknown>> {
  const { items, total } = await productsRepository.findMany(
    {
      search: query.search,
      categorySlug: query.category,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      activeOnly: !(canSeeInactive && query.includeInactive),
    },
    query.sort,
    (query.page - 1) * query.pageSize,
    query.pageSize,
  );

  return {
    items,
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
    },
  };
}

export async function getProduct(idOrSlug: string) {
  const asId = Number(idOrSlug);
  const product = Number.isInteger(asId)
    ? await productsRepository.findById(asId)
    : await productsRepository.findBySlug(idOrSlug);

  if (!product) throw new NotFoundError("Product not found.");
  return product;
}

export async function createProduct(input: CreateProductInput) {
  const category = await categoriesRepository.findById(input.categoryId);
  if (!category) throw new BadRequestError("categoryId does not reference an existing category.");

  const slug = await uniqueSlug(input.name);

  return productsRepository.create({
    name: input.name,
    slug,
    description: input.description,
    priceCents: input.priceCents,
    currency: input.currency,
    stock: input.stock,
    isActive: input.isActive,
    category: { connect: { id: input.categoryId } },
  });
}

export async function updateProduct(id: number, input: UpdateProductInput) {
  const product = await productsRepository.findById(id);
  if (!product) throw new NotFoundError("Product not found.");

  if (input.categoryId !== undefined) {
    const category = await categoriesRepository.findById(input.categoryId);
    if (!category) throw new BadRequestError("categoryId does not reference an existing category.");
  }

  const data: Record<string, unknown> = { ...input };
  delete data.categoryId;
  if (input.name && input.name !== product.name) {
    data.slug = await uniqueSlug(input.name);
  }
  if (input.categoryId !== undefined) {
    data.category = { connect: { id: input.categoryId } };
  }

  return productsRepository.update(id, data);
}

export async function deleteProduct(id: number) {
  const product = await productsRepository.findById(id);
  if (!product) throw new NotFoundError("Product not found.");

  const orderItemCount = await productsRepository.countOrderItemsForProduct(id);
  if (orderItemCount > 0) {
    throw new ConflictError(
      "This product appears in existing orders and cannot be deleted. Deactivate it instead.",
    );
  }

  await productsRepository.remove(id);
}

export async function adjustStock(id: number, input: AdjustStockInput) {
  const product = await productsRepository.findById(id);
  if (!product) throw new NotFoundError("Product not found.");

  const applied = await productsRepository.applyStockDelta(prisma, id, input.delta);
  if (!applied) {
    throw new ConflictError("Cannot reduce stock below zero.");
  }

  return productsRepository.findById(id);
}
