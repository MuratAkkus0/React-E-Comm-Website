import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

export function findPurchasedOrderItem(userId: number, productId: number) {
  return prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
      },
    },
  });
}

export function findExistingReview(userId: number, productId: number) {
  return prisma.review.findUnique({
    where: { userId_productId: { userId, productId } },
  });
}

export function findManyForProduct(productId: number, skip: number, take: number) {
  return Promise.all([
    prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.review.count({ where: { productId } }),
  ]);
}

export async function createReviewAndRefreshRating(
  userId: number,
  productId: number,
  rating: number,
  comment: string,
) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const review = await tx.review.create({
      data: { userId, productId, rating, comment },
    });

    const aggregate = await tx.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await tx.product.update({
      where: { id: productId },
      data: {
        ratingAvg: aggregate._avg.rating ?? 0,
        ratingCount: aggregate._count.rating,
      },
    });

    return review;
  });
}
