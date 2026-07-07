import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getBookById, getBookFileKey } from "@/lib/models/Book";
import { createOrderFromSession, updateOrderStatusByPaymentIntent } from "@/lib/models/Order";
import { upsertCustomerPurchase } from "@/lib/models/Customer";
import { getPresignedDownloadUrl } from "@/lib/r2";
import { sendPurchaseEmail } from "@/lib/email";

const DOWNLOAD_LINK_EXPIRY_SECONDS = 60 * 60 * 2; // 2 hours

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status !== "paid") break;

      const bookId = session.metadata?.bookId;
      const book = bookId ? await getBookById(bookId) : null;
      if (!book) break;

      const customerEmail = session.customer_details?.email || "unknown";
      const customerName = session.customer_details?.name || undefined;
      const amountTotal = session.amount_total ?? 0;
      const currency = (session.currency || book.currency).toUpperCase();

      const order = await createOrderFromSession({
        bookId: book._id!,
        bookTitle: book.title,
        bookSlug: book.slug,
        customerEmail,
        customerName,
        amountTotal,
        currency,
        status: "paid",
        stripeSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : undefined,
      });

      if (customerEmail !== "unknown") {
        await upsertCustomerPurchase(customerEmail, customerName, {
          bookId: book._id!,
          bookTitle: book.title,
          orderId: order._id!,
          amountTotal,
          currency,
          purchasedAt: order.createdAt,
        });
      }

      const fileKey = await getBookFileKey(book._id!);
      if (fileKey && customerEmail !== "unknown") {
        const downloadUrl = await getPresignedDownloadUrl(fileKey, DOWNLOAD_LINK_EXPIRY_SECONDS);
        await sendPurchaseEmail({
          to: customerEmail,
          customerName,
          bookTitle: book.title,
          downloadUrl,
        });
      }
      break;
    }

    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const paymentIntentId =
        typeof session.payment_intent === "string" ? session.payment_intent : undefined;
      if (paymentIntentId) {
        await updateOrderStatusByPaymentIntent(paymentIntentId, "failed");
      }
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId =
        typeof charge.payment_intent === "string" ? charge.payment_intent : undefined;
      if (paymentIntentId) {
        await updateOrderStatusByPaymentIntent(paymentIntentId, "refunded");
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
