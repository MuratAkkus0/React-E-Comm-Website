import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import {
  app,
  cleanupCategory,
  cleanupProduct,
  cleanupUser,
  createCategory,
  createProduct,
  registerUser,
} from "./helpers.js";
import { prisma } from "../src/lib/prisma.js";

describe("checkout oversell prevention", () => {
  let category: Awaited<ReturnType<typeof createCategory>>;
  let userA: Awaited<ReturnType<typeof registerUser>>;
  let userB: Awaited<ReturnType<typeof registerUser>>;

  beforeAll(async () => {
    category = await createCategory();
    userA = await registerUser("Buyer A");
    userB = await registerUser("Buyer B");
  });

  afterAll(async () => {
    await cleanupUser(userA.id);
    await cleanupUser(userB.id);
    await cleanupCategory(category.id);
  });

  it("allows only one of two concurrent checkouts to buy the last unit in stock", async () => {
    const product = await createProduct({ categoryId: category.id, stock: 1 });

    await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${userA.accessToken}`)
      .send({ productId: product.id, quantity: 1 })
      .expect(201);

    await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${userB.accessToken}`)
      .send({ productId: product.id, quantity: 1 })
      .expect(201);

    const shippingAddress = "221B Baker Street, London, NW1 6XE, United Kingdom";

    const [resultA, resultB] = await Promise.all([
      request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${userA.accessToken}`)
        .send({ shippingAddress }),
      request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${userB.accessToken}`)
        .send({ shippingAddress }),
    ]);

    const statuses = [resultA.status, resultB.status].sort();
    // Exactly one checkout succeeds (201), the other is rejected as a
    // conflict (409) because stock ran out — never both succeeding.
    expect(statuses).toEqual([201, 409]);

    const winner = resultA.status === 201 ? resultA : resultB;
    expect(winner.body.order.status).toBe("PENDING");
    expect(winner.body.order.items).toHaveLength(1);
    expect(winner.body.order.items[0].quantity).toBe(1);

    const finalProduct = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
    expect(finalProduct.stock).toBe(0);

    await cleanupProduct(product.id);
  });
});
