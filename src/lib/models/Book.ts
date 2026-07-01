import { ObjectId } from "mongodb";
import slugify from "slugify";
import { getDb } from "@/lib/mongodb";
import type { Book, BookInput } from "@/types/book";

const COLLECTION = "books";

function serialize(doc: any): Book {
  return {
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
    updatedAt: doc.updatedAt?.toISOString?.() ?? doc.updatedAt,
  };
}

export async function listBooks(opts: { publishedOnly?: boolean } = {}): Promise<Book[]> {
  const db = await getDb();
  const filter = opts.publishedOnly ? { published: true } : {};
  const docs = await db
    .collection(COLLECTION)
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(serialize);
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ slug });
  return doc ? serialize(doc) : null;
}

export async function getBookById(id: string): Promise<Book | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? serialize(doc) : null;
}

export async function createBook(input: BookInput): Promise<Book> {
  const db = await getDb();
  const now = new Date();
  const baseSlug = input.slug || slugify(input.title, { lower: true, strict: true });

  // Ensure slug uniqueness by appending a short suffix if needed.
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

export async function updateBook(id: string, input: Partial<BookInput>): Promise<Book | null> {
  const db = await getDb();
  const update = { ...input, updatedAt: new Date() };
  await db.collection(COLLECTION).updateOne({ _id: new ObjectId(id) }, { $set: update });
  return getBookById(id);
}

export async function deleteBook(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
