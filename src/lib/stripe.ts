import Stripe from "stripe";

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

let _stripe: Stripe | null = null;

/**
 * Lazily constructs the Stripe client on first use, rather than at module
 * load time. Next.js imports every route module during `next build`'s
 * "collect page data" step even if the code path is never executed, so
 * constructing `new Stripe(...)` at the top level crashes the entire build
 * whenever `STRIPE_SECRET_KEY` isn't present in the build environment.
 */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("Missing STRIPE_SECRET_KEY environment variable");
    }
    _stripe = new Stripe(key);
  }
  return _stripe;
}
