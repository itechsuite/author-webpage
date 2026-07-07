import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { SocialLink, SocialLinkInput } from "@/types/socialLink";

const COLLECTION = "social_links";

function serialize(doc: any): SocialLink {
  return {
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
    updatedAt: doc.updatedAt?.toISOString?.() ?? doc.updatedAt,
  };
}

export async function listSocialLinks(): Promise<SocialLink[]> {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find({}).sort({ order: 1 }).toArray();
  return docs.map(serialize);
}

export async function createSocialLink(input: SocialLinkInput): Promise<SocialLink> {
  const db = await getDb();
  const now = new Date();
  const doc = { ...input, createdAt: now, updatedAt: now };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return serialize({ ...doc, _id: result.insertedId });
}

export async function updateSocialLink(
  id: string,
  input: Partial<SocialLinkInput>
): Promise<SocialLink | null> {
  const db = await getDb();
  await db
    .collection(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...input, updatedAt: new Date() } });
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? serialize(doc) : null;
}

export async function deleteSocialLink(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
