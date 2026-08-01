import request from "supertest";
import { createApp } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

export const app = createApp();

let uniqueCounter = 0;
function unique(): string {
  uniqueCounter += 1;
  return `${Date.now()}_${process.pid}_${uniqueCounter}`;
}

export async function registerUser(name = "Test User") {
  const email = `test_${unique()}@example.com`;
  const password = "TestPass123!";

  const res = await request(app).post("/api/auth/register").send({ name, email, password });
  if (res.status !== 201) {
    throw new Error(`Failed to register test user: ${res.status} ${JSON.stringify(res.body)}`);
  }

  return {
    id: res.body.user.id as number,
    email,
    password,
    accessToken: res.body.accessToken as string,
  };
}

export async function createCategory() {
  return prisma.category.create({
    data: { name: `Test Category ${unique()}`, slug: `test-category-${unique()}` },
  });
}

export async function createProduct(overrides: {
  categoryId: number;
  stock: number;
  priceCents?: number;
}) {
  const suffix = unique();
  return prisma.product.create({
    data: {
      name: `Test Product ${suffix}`,
      slug: `test-product-${suffix}`,
      description: "A product created for automated tests.",
      priceCents: overrides.priceCents ?? 1000,
      currency: "EUR",
      stock: overrides.stock,
      categoryId: overrides.categoryId,
    },
  });
}

export async function cleanupProduct(productId: number) {
  await prisma.orderItem.deleteMany({ where: { productId } });
  await prisma.cartItem.deleteMany({ where: { productId } });
  await prisma.review.deleteMany({ where: { productId } });
  await prisma.product.delete({ where: { id: productId } }).catch(() => undefined);
}

export async function cleanupCategory(categoryId: number) {
  await prisma.category.delete({ where: { id: categoryId } }).catch(() => undefined);
}

export async function cleanupUser(userId: number) {
  const orders = await prisma.order.findMany({ where: { userId }, select: { id: true } });
  const orderIds = orders.map((o) => o.id);
  await prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
  await prisma.order.deleteMany({ where: { userId } });
  await prisma.cartItem.deleteMany({ where: { userId } });
  await prisma.refreshToken.deleteMany({ where: { userId } });
  await prisma.review.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } }).catch(() => undefined);
}
