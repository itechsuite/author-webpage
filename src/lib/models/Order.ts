import { getDb } from "@/lib/mongodb";
import type { Order } from "@/types/order";

const COLLECTION = "orders";

function serialize(doc: any): Order {
  return {
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
  };
}

export async function listOrders(): Promise<Order[]> {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(serialize);
}

export async function getOrderBySessionId(stripeSessionId: string): Promise<Order | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ stripeSessionId });
  return doc ? serialize(doc) : null;
}

/**
 * Called only from the Stripe webhook. Idempotent — Stripe redelivers events,
 * so a duplicate `checkout.session.completed` for the same session must not
 * create a second order.
 */
export async function createOrderFromSession(
  input: Omit<Order, "_id" | "createdAt">
): Promise<Order> {
  const existing = await getOrderBySessionId(input.stripeSessionId);
  if (existing) return existing;

  const db = await getDb();
  const doc = { ...input, createdAt: new Date() };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return serialize({ ...doc, _id: result.insertedId });
}

export async function updateOrderStatusByPaymentIntent(
  stripePaymentIntentId: string,
  status: Order["status"]
): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).updateOne({ stripePaymentIntentId }, { $set: { status } });
}
