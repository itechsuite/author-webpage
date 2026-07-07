import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// Currencies Stripe treats as having no minor unit — the charge amount is
// the integer amount itself, not amount * 100. https://docs.stripe.com/currencies#zero-decimal
const ZERO_DECIMAL_CURRENCIES = new Set([
  "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga", "pyg", "rwf",
  "ugx", "vnd", "vuv", "xaf", "xof", "xpf",
]);

/** Converts a major-unit price (e.g. 20000.00 NGN) to Stripe's smallest-unit integer. */
export function toStripeAmount(price: number, currency: string): number {
  if (ZERO_DECIMAL_CURRENCIES.has(currency.toLowerCase())) {
    return Math.round(price);
  }
  return Math.round(price * 100);
}
