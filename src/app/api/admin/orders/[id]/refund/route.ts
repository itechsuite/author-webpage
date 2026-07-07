import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { getDb } from "@/lib/mongodb";
import { stripe } from "@/lib/stripe";

/**
 * Triggers a Stripe refund for an order. Doesn't flip the order's own status
 * itself — the existing `charge.refunded` webhook handler is the single
 * source of truth for that, same as every other status transition.
 */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasPermission(session?.role, "issueRefunds")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = await getDb();
  const order = await db.collection("orders").findOne({ _id: new ObjectId(id) });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (!order.stripePaymentIntentId) {
    return NextResponse.json({ error: "No payment intent on this order" }, { status: 400 });
  }
  if (order.status === "refunded") {
    return NextResponse.json({ error: "Already refunded" }, { status: 400 });
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent: order.stripePaymentIntentId,
    });
    return NextResponse.json({ refund });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Refund failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
