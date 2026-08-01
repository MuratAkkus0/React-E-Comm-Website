import type { CreateReviewInput, Paginated } from "@ecomm/shared";
import { ConflictError, ForbiddenError, NotFoundError } from "../../lib/errors.js";
import * as reviewsRepository from "./reviews.repository.js";
import * as productsRepository from "../products/products.repository.js";

export async function listReviews(
  productId: number,
  page: number,
  pageSize: number,
): Promise<Paginated<unknown>> {
  const [items, total] = await reviewsRepository.findManyForProduct(
    productId,
    (page - 1) * pageSize,
    pageSize,
  );
  return {
    items,
    pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
  };
}

export async function createReview(userId: number, productId: number, input: CreateReviewInput) {
  const product = await productsRepository.findById(productId);
  if (!product) throw new NotFoundError("Product not found.");

  const purchase = await reviewsRepository.findPurchasedOrderItem(userId, productId);
  if (!purchase) {
    throw new ForbiddenError("You can only review products from an order you have paid for.");
  }

  const existing = await reviewsRepository.findExistingReview(userId, productId);
  if (existing) {
    throw new ConflictError("You have already reviewed this product.");
  }

  return reviewsRepository.createReviewAndRefreshRating(
    userId,
    productId,
    input.rating,
    input.comment,
  );
}
