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

describe("product reviews", () => {
  let category: Awaited<ReturnType<typeof createCategory>>;
  let product: Awaited<ReturnType<typeof createProduct>>;
  let buyer: Awaited<ReturnType<typeof registerUser>>;
  let nonBuyer: Awaited<ReturnType<typeof registerUser>>;

  beforeAll(async () => {
    category = await createCategory();
    product = await createProduct({ categoryId: category.id, stock: 10 });
    buyer = await registerUser("Buyer");
    nonBuyer = await registerUser("Window Shopper");

    await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${buyer.accessToken}`)
      .send({ productId: product.id, quantity: 1 })
      .expect(201);

    const checkoutRes = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${buyer.accessToken}`)
      .send({ shippingAddress: "1 Test Way, Testville, T3 5TT, United Kingdom" })
      .expect(201);

    await request(app)
      .post(`/api/orders/${checkoutRes.body.order.id}/pay`)
      .set("Authorization", `Bearer ${buyer.accessToken}`)
      .expect(200);
  });

  afterAll(async () => {
    await cleanupUser(buyer.id);
    await cleanupUser(nonBuyer.id);
    await cleanupProduct(product.id);
    await cleanupCategory(category.id);
  });

  it("rejects a review from a user who never purchased the product", async () => {
    const res = await request(app)
      .post(`/api/products/${product.id}/reviews`)
      .set("Authorization", `Bearer ${nonBuyer.accessToken}`)
      .send({ rating: 5, comment: "Looks great in photos." });

    expect(res.status).toBe(403);
  });

  it("lets a buyer review a paid-for product exactly once", async () => {
    const first = await request(app)
      .post(`/api/products/${product.id}/reviews`)
      .set("Authorization", `Bearer ${buyer.accessToken}`)
      .send({ rating: 4, comment: "Solid build quality, works as expected." });

    expect(first.status).toBe(201);

    const second = await request(app)
      .post(`/api/products/${product.id}/reviews`)
      .set("Authorization", `Bearer ${buyer.accessToken}`)
      .send({ rating: 5, comment: "Trying to review it again." });

    expect(second.status).toBe(409);
  });
});
