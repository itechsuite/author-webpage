import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { ContactThread, ContactMessage } from "@/types/contact";

const COLLECTION = "contact_threads";

function serialize(doc: any): ContactThread {
  return {
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
    updatedAt: doc.updatedAt?.toISOString?.() ?? doc.updatedAt,
  };
}

export async function listContactThreads(): Promise<ContactThread[]> {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find({}).sort({ updatedAt: -1 }).toArray();
  return docs.map(serialize);
}

export async function getContactThreadById(id: string): Promise<ContactThread | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? serialize(doc) : null;
}

export async function createContactThread(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<ContactThread> {
  const db = await getDb();
  const now = new Date();

  const firstMessage: ContactMessage = {
    from: "customer",
    body: input.message,
    createdAt: now.toISOString(),
  };

  const doc = {
    name: input.name,
    email: input.email,
    subject: input.subject,
    status: "open" as const,
    messages: [firstMessage],
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection(COLLECTION).insertOne(doc);
  return serialize({ ...doc, _id: result.insertedId });
}

export async function addThreadMessage(
  id: string,
  message: ContactMessage
): Promise<ContactThread | null> {
  const db = await getDb();
  const now = new Date();

  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $push: { messages: message } as any, $set: { updatedAt: now } }
  );

  return getContactThreadById(id);
}

export async function setThreadStatus(
  id: string,
  status: ContactThread["status"]
): Promise<void> {
  const db = await getDb();
  await db
    .collection(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } });
}
