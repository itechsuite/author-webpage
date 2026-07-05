import { ObjectId } from "mongodb";
import slugify from "slugify";
import { getDb } from "@/lib/mongodb";
import type { Category, CategoryInput } from "@/types/category";

const COLLECTION = "categories";

function serialize(doc: any): Category {
  return {
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
    updatedAt: doc.updatedAt?.toISOString?.() ?? doc.updatedAt,
  };
}

export async function listCategories(): Promise<Category[]> {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find({}).sort({ name: 1 }).toArray();
  return docs.map(serialize);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ slug });
  return doc ? serialize(doc) : null;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? serialize(doc) : null;
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const db = await getDb();
  const now = new Date();
  const baseSlug = input.slug || slugify(input.name, { lower: true, strict: true });

  let slug = baseSlug;
  let attempt = 0;
  while (await db.collection(COLLECTION).findOne({ slug })) {
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  const doc = { ...input, slug, createdAt: now, updatedAt: now };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return serialize({ ...doc, _id: result.insertedId });
}

export async function updateCategory(
  id: string,
  input: Partial<CategoryInput>
): Promise<Category | null> {
  const db = await getDb();
  const update = { ...input, updatedAt: new Date() };
  await db.collection(COLLECTION).updateOne({ _id: new ObjectId(id) }, { $set: update });
  return getCategoryById(id);
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
