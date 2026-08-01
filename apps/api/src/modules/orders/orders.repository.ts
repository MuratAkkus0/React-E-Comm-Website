import type { OrderStatus, Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

export function findCartForCheckout(userId: number) {
  return prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
}

export function clearCart(tx: Prisma.TransactionClient, userId: number) {
  return tx.cartItem.deleteMany({ where: { userId } });
}

export function createOrder(
  tx: Prisma.TransactionClient,
  data: {
    userId: number;
    totalCents: number;
    currency: string;
    shippingAddress: string;
    items: Array<{
      productId: number;
      productName: string;
      unitPriceCents: number;
      quantity: number;
    }>;
  },
) {
  return tx.order.create({
    data: {
      userId: data.userId,
      totalCents: data.totalCents,
      currency: data.currency,
      shippingAddress: data.shippingAddress,
      status: "PENDING",
      items: { create: data.items },
    },
    include: { items: true },
  });
}

export function findById(id: number) {
  return prisma.order.findUnique({ where: { id }, include: { items: true } });
}

export function findByIdForUpdate(tx: Prisma.TransactionClient, id: number) {
  return tx.order.findUnique({ where: { id }, include: { items: true } });
}

export function findManyForUser(userId: number, skip: number, take: number) {
  return Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.order.count({ where: { userId } }),
  ]);
}

export function findManyAdmin(status: OrderStatus | undefined, skip: number, take: number) {
  const where = status ? { status } : {};
  return Promise.all([
    prisma.order.findMany({
      where,
      include: { items: true, user: { select: { id: true, email: true, name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.order.count({ where }),
  ]);
}

export function updateStatus(
  tx: Prisma.TransactionClient,
  id: number,
  status: OrderStatus,
  extra: Record<string, unknown> = {},
) {
  return tx.order.update({ where: { id }, data: { status, ...extra } });
}
