import type { PaymentProvider } from "./payment.provider.js";
import { MockPaymentProvider } from "./mock-payment.provider.js";

// The single line to change when integrating a real payment provider.
export const paymentProvider: PaymentProvider = new MockPaymentProvider();

export type { PaymentProvider, ChargeParams, ChargeResult } from "./payment.provider.js";
