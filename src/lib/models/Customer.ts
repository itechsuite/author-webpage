import { getDb } from "@/lib/mongodb";
import type { Customer, CustomerPurchase } from "@/types/customer";

const COLLECTION = "customers";

function serialize(doc: any): Customer {
  return {
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
    updatedAt: doc.updatedAt?.toISOString?.() ?? doc.updatedAt,
  };
}

export async function listCustomers(): Promise<Customer[]> {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find({}).sort({ updatedAt: -1 }).toArray();
  return docs.map(serialize);
}

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ email });
  return doc ? serialize(doc) : null;
}

/**
 * Adds a purchase to a customer's history, creating the customer record on
 * their first purchase. Called from the Stripe webhook alongside
 * createOrderFromSession.
 */
export async function upsertCustomerPurchase(
  email: string,
  name: string | undefined,
  purchase: CustomerPurchase
): Promise<void> {
  const db = await getDb();
  const now = new Date();

  await db.collection(COLLECTION).updateOne(
    { email },
    {
      $push: { purchases: purchase } as any,
      $set: { updatedAt: now, ...(name ? { name } : {}) },
      $setOnInsert: { email, createdAt: now },
    },
    { upsert: true }
  );
}
