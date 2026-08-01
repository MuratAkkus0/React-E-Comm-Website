import crypto from "node:crypto";
import type { ChargeParams, ChargeResult, PaymentProvider } from "./payment.provider.js";

/**
 * A mock payment gateway: it always succeeds immediately and never talks
 * to any external network. This is intentionally the ONLY payment
 * integration in the project — see the README's "Payment" section for
 * why, and for what swapping in a real provider (e.g. Stripe PaymentIntents)
 * would involve: implementing PaymentProvider against the real API and
 * changing the single export in ./index.ts.
 */
export class MockPaymentProvider implements PaymentProvider {
  async charge({ orderId }: ChargeParams): Promise<ChargeResult> {
    return {
      success: true,
      reference: `mock_${orderId}_${crypto.randomUUID()}`,
    };
  }
}
