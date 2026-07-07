export interface Order {
  _id?: string;
  bookId: string;
  bookTitle: string; // snapshot at purchase time
  bookSlug: string; // snapshot at purchase time
  customerEmail: string;
  customerName?: string;
  amountTotal: number; // smallest currency unit, as reported by Stripe
  currency: string;
  status: "paid" | "failed" | "refunded";
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  createdAt: string;
}
