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

describe("order authorization", () => {
  let category: Awaited<ReturnType<typeof createCategory>>;
  let product: Awaited<ReturnType<typeof createProduct>>;
  let userA: Awaited<ReturnType<typeof registerUser>>;
  let userB: Awaited<ReturnType<typeof registerUser>>;
  let orderId: number;

  beforeAll(async () => {
    category = await createCategory();
    product = await createProduct({ categoryId: category.id, stock: 10 });
    userA = await registerUser("Owner");
    userB = await registerUser("Intruder");

    await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${userA.accessToken}`)
      .send({ productId: product.id, quantity: 2 })
      .expect(201);

    const checkoutRes = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userA.accessToken}`)
      .send({ shippingAddress: "1 Test Way, Testville, T3 5TT, United Kingdom" })
      .expect(201);

    orderId = checkoutRes.body.order.id;
  });

  afterAll(async () => {
    await cleanupUser(userA.id);
    await cleanupUser(userB.id);
    await cleanupProduct(product.id);
    await cleanupCategory(category.id);
  });

  it("lets the owner read their own order", async () => {
    const res = await request(app)
      .get(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${userA.accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.order.id).toBe(orderId);
  });

  it("does not let another user read someone else's order", async () => {
    const res = await request(app)
      .get(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${userB.accessToken}`);

    expect(res.status).toBe(404);
  });

  it("does not let another user cancel someone else's order", async () => {
    const res = await request(app)
      .patch(`/api/orders/${orderId}/cancel`)
      .set("Authorization", `Bearer ${userB.accessToken}`);

    expect(res.status).toBe(404);
  });

  it("rejects unauthenticated access entirely", async () => {
    const res = await request(app).get(`/api/orders/${orderId}`);
    expect(res.status).toBe(401);
  });
});
