import type { CartItemInput, MergeCartInput, UpdateCartItemInput } from "@ecomm/shared";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import * as cartRepository from "./cart.repository.js";
import * as productsRepository from "../products/products.repository.js";

function toCartView(rows: Awaited<ReturnType<typeof cartRepository.findCartItems>>) {
  const items = rows.map((row) => ({
    productId: row.productId,
    quantity: row.quantity,
    product: row.product,
    lineTotalCents: row.product.priceCents * row.quantity,
  }));
  const totalCents = items.reduce((sum, item) => sum + item.lineTotalCents, 0);
  const currency = items[0]?.product.currency ?? "EUR";
  return { items, totalCents, currency };
}

export async function getCart(userId: number) {
  const rows = await cartRepository.findCartItems(userId);
  return toCartView(rows);
}

export async function addItem(userId: number, input: CartItemInput) {
  const product = await productsRepository.findById(input.productId);
  if (!product || !product.isActive) {
    throw new NotFoundError("Product not found.");
  }

  const existing = await cartRepository.findCartItem(userId, input.productId);
  const nextQuantity = (existing?.quantity ?? 0) + input.quantity;

  if (nextQuantity > product.stock) {
    throw new BadRequestError(
      `Only ${product.stock} unit(s) of "${product.name}" are in stock.`,
    );
  }

  await cartRepository.upsertCartItem(userId, input.productId, nextQuantity);
  return getCart(userId);
}

export async function updateItem(userId: number, productId: number, input: UpdateCartItemInput) {
  const existing = await cartRepository.findCartItem(userId, productId);
  if (!existing) throw new NotFoundError("This product is not in your cart.");

  if (input.quantity === 0) {
    await cartRepository.deleteCartItem(userId, productId);
    return getCart(userId);
  }

  const product = await productsRepository.findById(productId);
  if (!product) throw new NotFoundError("Product not found.");
  if (input.quantity > product.stock) {
    throw new BadRequestError(`Only ${product.stock} unit(s) of "${product.name}" are in stock.`);
  }

  await cartRepository.setCartItemQuantity(userId, productId, input.quantity);
  return getCart(userId);
}

export async function removeItem(userId: number, productId: number) {
  const existing = await cartRepository.findCartItem(userId, productId);
  if (!existing) throw new NotFoundError("This product is not in your cart.");
  await cartRepository.deleteCartItem(userId, productId);
  return getCart(userId);
}

export async function clearCart(userId: number) {
  await cartRepository.clearCart(userId);
  return getCart(userId);
}

/**
 * Folds a guest (localStorage) cart into the user's persistent cart on
 * login. Unknown, inactive or out-of-stock lines are silently skipped
 * rather than failing the whole merge — the guest cart is best-effort.
 */
export async function mergeCart(userId: number, input: MergeCartInput) {
  for (const line of input.items) {
    const product = await productsRepository.findById(line.productId);
    if (!product || !product.isActive) continue;

    const existing = await cartRepository.findCartItem(userId, line.productId);
    const merged = Math.min((existing?.quantity ?? 0) + line.quantity, product.stock, 99);
    if (merged <= 0) continue;

    await cartRepository.upsertCartItem(userId, line.productId, merged);
  }
  return getCart(userId);
}
