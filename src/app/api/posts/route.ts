import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listPosts, createPost } from "@/lib/models/Post";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().min(1),
  content: z.any(),
  coverImageUrl: z.string().url(),
  coverImageAlt: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "scheduled", "published"]).default("draft"),
  publishedAt: z.string().optional(),
  scheduledAt: z.string().optional(),
  authorName: z.string().min(1),
  authorAvatarUrl: z.string().url().optional().or(z.literal("")),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      ogImageUrl: z.string().url().optional().or(z.literal("")),
    })
    .default({}),
  featured: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  const session = await getSession();
  const { searchParams } = new URL(req.url);

  const status = (searchParams.get("status") as "draft" | "scheduled" | "published" | null) || undefined;
  const category = searchParams.get("category") || undefined;
  const tag = searchParams.get("tag") || undefined;
  const featured = searchParams.get("featured") === "true";
  const search = searchParams.get("search") || undefined;
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");

  // Non-admin requests always get the publicly-visible set, regardless of
  // any status filter they try to pass.
  const result = await listPosts(
    session
      ? { status, category, tag, featuredOnly: featured || undefined, search, page, limit }
      : { publishedOnly: true, category, tag, featuredOnly: featured || undefined, search, page, limit }
  );

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageContent")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  if (parsed.data.content === undefined) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const post = await createPost({ ...parsed.data, content: parsed.data.content });
  return NextResponse.json({ post }, { status: 201 });
}
