export interface ChargeParams {
  orderId: number;
  amountCents: number;
  currency: string;
}

export interface ChargeResult {
  success: boolean;
  reference: string;
}

/**
 * The boundary between "we placed an order" and "money actually moved".
 * Every payment integration (mock today, Stripe/Adyen/whatever tomorrow)
 * implements this one interface. The order service only ever talks to a
 * `PaymentProvider`, never to a concrete implementation — see
 * ./index.ts for the single line that would need to change to plug in a
 * real provider.
 */
export interface PaymentProvider {
  charge(params: ChargeParams): Promise<ChargeResult>;
}
