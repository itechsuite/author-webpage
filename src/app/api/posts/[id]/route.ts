import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPostById, updatePost, deletePost } from "@/lib/models/Post";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";

const postUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  excerpt: z.string().min(1).optional(),
  content: z.any().optional(),
  coverImageUrl: z.string().url().optional(),
  coverImageAlt: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "scheduled", "published"]).optional(),
  publishedAt: z.string().optional(),
  scheduledAt: z.string().optional(),
  authorName: z.string().min(1).optional(),
  authorAvatarUrl: z.string().url().optional().or(z.literal("")),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      ogImageUrl: z.string().url().optional().or(z.literal("")),
    })
    .optional(),
  featured: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageContent")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await getPostById(id);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ post });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageContent")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = postUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const post = await updatePost(id, parsed.data);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ post });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageContent")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deletePost(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
