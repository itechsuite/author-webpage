import { ObjectId } from "mongodb";
import slugify from "slugify";
import readingTime from "reading-time";
import { generateHTML } from "@tiptap/html/server";
import { getDb } from "@/lib/mongodb";
import { buildTiptapExtensions } from "@/lib/tiptap-extensions";
import type { Post, PostInput } from "@/types/post";

const COLLECTION = "posts";

function serialize(doc: any): Post {
  return {
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
    updatedAt: doc.updatedAt?.toISOString?.() ?? doc.updatedAt,
    publishedAt: doc.publishedAt?.toISOString?.() ?? doc.publishedAt,
    scheduledAt: doc.scheduledAt?.toISOString?.() ?? doc.scheduledAt,
  };
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function renderContent(content: any): { contentHtml: string; readingTimeMinutes: number } {
  const contentHtml = generateHTML(content, buildTiptapExtensions());
  const minutes = readingTime(htmlToPlainText(contentHtml)).minutes;
  return { contentHtml, readingTimeMinutes: Math.max(1, Math.ceil(minutes)) };
}

interface ListPostsOptions {
  publishedOnly?: boolean;
  status?: "draft" | "scheduled" | "published";
  category?: string;
  tag?: string;
  featuredOnly?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * A post is publicly visible once it's "published", or once a "scheduled"
 * post's target time has passed — checked lazily on read, no cron needed.
 */
function publiclyVisibleClause() {
  const now = new Date();
  return {
    $or: [
      { status: "published", publishedAt: { $lte: now } },
      { status: "scheduled", scheduledAt: { $lte: now } },
    ],
  };
}

export async function listPosts(
  opts: ListPostsOptions = {}
): Promise<{ posts: Post[]; total: number }> {
  const db = await getDb();
  const { publishedOnly, status, category, tag, featuredOnly, search, page = 1, limit = 10 } = opts;

  const clauses: Record<string, any>[] = [];

  if (publishedOnly) {
    clauses.push(publiclyVisibleClause());
  } else if (status) {
    clauses.push({ status });
  }
  if (category) clauses.push({ category });
  if (tag) clauses.push({ tags: tag });
  if (featuredOnly) clauses.push({ featured: true });
  if (search) {
    clauses.push({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ],
    });
  }

  const filter = clauses.length > 0 ? { $and: clauses } : {};

  const collection = db.collection(COLLECTION);
  const total = await collection.countDocuments(filter);
  const docs = await collection
    .find(filter)
    .sort({ publishedAt: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return { posts: docs.map(serialize), total };
}

export async function getPostBySlug(slug: string, opts: { publishedOnly?: boolean } = {}) {
  const db = await getDb();
  const filter: Record<string, any> = opts.publishedOnly
    ? { $and: [{ slug }, publiclyVisibleClause()] }
    : { slug };
  const doc = await db.collection(COLLECTION).findOne(filter);
  return doc ? serialize(doc) : null;
}

export async function getPostById(id: string): Promise<Post | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? serialize(doc) : null;
}

export async function listAllTags(): Promise<string[]> {
  const db = await getDb();
  const tags = await db.collection(COLLECTION).distinct("tags");
  return (tags as string[]).sort();
}

export async function createPost(input: PostInput): Promise<Post> {
  const db = await getDb();
  const now = new Date();
  const baseSlug = input.slug || slugify(input.title, { lower: true, strict: true });

  let slug = baseSlug;
  let attempt = 0;
  while (await db.collection(COLLECTION).findOne({ slug })) {
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  const { contentHtml, readingTimeMinutes } = renderContent(input.content);

  const publishedAt =
    input.status === "published" ? input.publishedAt ?? now.toISOString() : input.publishedAt;

  const doc = {
    ...input,
    slug,
    contentHtml,
    readingTimeMinutes,
    publishedAt: publishedAt ? new Date(publishedAt) : undefined,
    scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection(COLLECTION).insertOne(doc);
  return serialize({ ...doc, _id: result.insertedId });
}

export async function updatePost(id: string, input: Partial<PostInput>): Promise<Post | null> {
  const db = await getDb();
  const existing = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  if (!existing) return null;

  const update: Record<string, any> = { ...input, updatedAt: new Date() };

  if (input.content) {
    const { contentHtml, readingTimeMinutes } = renderContent(input.content);
    update.contentHtml = contentHtml;
    update.readingTimeMinutes = readingTimeMinutes;
  }

  if (input.status === "published" && existing.status !== "published" && !existing.publishedAt) {
    update.publishedAt = new Date();
  } else if (input.publishedAt) {
    update.publishedAt = new Date(input.publishedAt);
  }

  if (input.scheduledAt) {
    update.scheduledAt = new Date(input.scheduledAt);
  }

  await db.collection(COLLECTION).updateOne({ _id: new ObjectId(id) }, { $set: update });
  return getPostById(id);
}

export async function deletePost(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
