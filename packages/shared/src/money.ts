/**
 * Money is always an integer number of minor currency units (cents) plus
 * an explicit ISO-4217 currency code. Never a float. This helper is the
 * only place formatting happens, on both server (logs/emails, if any) and
 * client (display).
 */
export function formatMoney(cents: number, currency: string, locale = "en-IE"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(cents / 100);
}
