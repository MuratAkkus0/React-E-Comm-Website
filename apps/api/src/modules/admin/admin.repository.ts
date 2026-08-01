import { prisma } from "../../lib/prisma.js";

const LOW_STOCK_THRESHOLD = 5;

export function countOrdersByStatus() {
  return prisma.order.groupBy({ by: ["status"], _count: { _all: true } });
}

export function sumRevenueCents() {
  return prisma.order.aggregate({
    where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
    _sum: { totalCents: true },
  });
}

export function countLowStockProducts() {
  return prisma.product.count({
    where: { isActive: true, stock: { lt: LOW_STOCK_THRESHOLD } },
  });
}

export function findLowStockProducts() {
  return prisma.product.findMany({
    where: { isActive: true, stock: { lt: LOW_STOCK_THRESHOLD } },
    orderBy: { stock: "asc" },
    take: 20,
  });
}

export function countProducts() {
  return prisma.product.count();
}

export function countUsers() {
  return prisma.user.count();
}
