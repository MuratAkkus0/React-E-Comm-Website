import type { CheckoutInput, Paginated } from "@ecomm/shared";
import type { OrderStatus } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { BadRequestError, ConflictError, NotFoundError } from "../../lib/errors.js";
import * as ordersRepository from "./orders.repository.js";
import * as productsRepository from "../products/products.repository.js";
import { paymentProvider } from "./payment/index.js";

/**
 * The order lifecycle. Every transition not listed here is illegal and
 * rejected regardless of who is asking or which route they call — the
 * state machine lives here, not in any one controller.
 */
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

function assertTransition(from: OrderStatus, to: OrderStatus) {
  if (!ALLOWED_TRANSITIONS[from].includes(to)) {
    throw new ConflictError(`Cannot move an order from ${from} to ${to}.`);
  }
}

interface Actor {
  id: number;
  role: "USER" | "ADMIN";
}

/**
 * Loads an order and enforces "a user can only read their own orders".
 * Returns 404 (not 403) for orders that exist but belong to someone else,
 * so an attacker probing order ids cannot distinguish "not yours" from
 * "does not exist".
 */
async function loadOwnedOrder(actor: Actor, orderId: number) {
  const order = await ordersRepository.findById(orderId);
  if (!order) throw new NotFoundError("Order not found.");
  if (order.userId !== actor.id && actor.role !== "ADMIN") {
    throw new NotFoundError("Order not found.");
  }
  return order;
}

/**
 * Checkout: recomputes the total from the CURRENT database prices of the
 * items in the caller's own cart (never trusts a client-supplied total or
 * per-line price), then decrements stock for every line inside a single
 * transaction. Each stock decrement is an atomic, conditional UPDATE
 * (`stock >= quantity`), so two concurrent checkouts racing for the last
 * unit of a product can never both succeed: the row lock acquired by the
 * first UPDATE serializes the second, which then observes stock = 0 and
 * fails cleanly with a 409 instead of an oversold order.
 */
export async function checkout(userId: number, input: CheckoutInput) {
  const cartItems = await ordersRepository.findCartForCheckout(userId);
  if (cartItems.length === 0) {
    throw new BadRequestError("Your cart is empty.");
  }

  for (const item of cartItems) {
    if (!item.product.isActive) {
      throw new ConflictError(`"${item.product.name}" is no longer available.`);
    }
  }

  const currency = cartItems[0].product.currency;
  const totalCents = cartItems.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0,
  );

  const order = await prisma.$transaction(async (tx) => {
    for (const item of cartItems) {
      const applied = await productsRepository.applyStockDelta(tx, item.productId, -item.quantity);
      if (!applied) {
        throw new ConflictError(
          `Not enough stock for "${item.product.name}". Please update your cart.`,
        );
      }
    }

    const created = await ordersRepository.createOrder(tx, {
      userId,
      totalCents,
      currency,
      shippingAddress: input.shippingAddress,
      items: cartItems.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        unitPriceCents: item.product.priceCents,
        quantity: item.quantity,
      })),
    });

    await ordersRepository.clearCart(tx, userId);
    return created;
  });

  return order;
}

/** Mock payment step: PENDING -> PAID. See modules/orders/payment. */
export async function payOrder(actor: Actor, orderId: number) {
  const order = await loadOwnedOrder(actor, orderId);
  assertTransition(order.status, "PAID");

  const result = await paymentProvider.charge({
    orderId: order.id,
    amountCents: order.totalCents,
    currency: order.currency,
  });

  if (!result.success) {
    throw new ConflictError("Payment failed. Please try again.");
  }

  return prisma.$transaction(async (tx) => {
    const fresh = await ordersRepository.findByIdForUpdate(tx, orderId);
    if (!fresh) throw new NotFoundError("Order not found.");
    assertTransition(fresh.status, "PAID");
    return ordersRepository.updateStatus(tx, orderId, "PAID", { paymentRef: result.reference });
  });
}

/** User or admin cancellation. Restocks every line if the order had already reserved stock. */
export async function cancelOrder(actor: Actor, orderId: number) {
  const order = await loadOwnedOrder(actor, orderId);
  assertTransition(order.status, "CANCELLED");

  return prisma.$transaction(async (tx) => {
    const fresh = await ordersRepository.findByIdForUpdate(tx, orderId);
    if (!fresh) throw new NotFoundError("Order not found.");
    assertTransition(fresh.status, "CANCELLED");

    for (const item of fresh.items) {
      await productsRepository.applyStockDelta(tx, item.productId, item.quantity);
    }

    return ordersRepository.updateStatus(tx, orderId, "CANCELLED");
  });
}

/** Admin-only fulfillment transitions: PAID -> SHIPPED -> DELIVERED. */
export async function updateOrderStatus(orderId: number, targetStatus: "SHIPPED" | "DELIVERED") {
  return prisma.$transaction(async (tx) => {
    const order = await ordersRepository.findByIdForUpdate(tx, orderId);
    if (!order) throw new NotFoundError("Order not found.");
    assertTransition(order.status, targetStatus);
    return ordersRepository.updateStatus(tx, orderId, targetStatus);
  });
}

export async function getOrder(actor: Actor, orderId: number) {
  return loadOwnedOrder(actor, orderId);
}

export async function listOrdersForUser(
  userId: number,
  page: number,
  pageSize: number,
): Promise<Paginated<unknown>> {
  const [items, total] = await ordersRepository.findManyForUser(
    userId,
    (page - 1) * pageSize,
    pageSize,
  );
  return {
    items,
    pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
  };
}

export async function listOrdersAdmin(
  status: OrderStatus | undefined,
  page: number,
  pageSize: number,
): Promise<Paginated<unknown>> {
  const [items, total] = await ordersRepository.findManyAdmin(
    status,
    (page - 1) * pageSize,
    pageSize,
  );
  return {
    items,
    pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
  };
}
