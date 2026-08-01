import { prisma } from "../../lib/prisma.js";

export function findCartItems(userId: number) {
  return prisma.cartItem.findMany({
    where: { userId },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export function findCartItem(userId: number, productId: number) {
  return prisma.cartItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });
}

export function upsertCartItem(userId: number, productId: number, quantity: number) {
  return prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    create: { userId, productId, quantity },
    update: { quantity },
  });
}

export function setCartItemQuantity(userId: number, productId: number, quantity: number) {
  return prisma.cartItem.update({
    where: { userId_productId: { userId, productId } },
    data: { quantity },
  });
}

export function deleteCartItem(userId: number, productId: number) {
  return prisma.cartItem.delete({
    where: { userId_productId: { userId, productId } },
  });
}

export function clearCart(userId: number) {
  return prisma.cartItem.deleteMany({ where: { userId } });
}
