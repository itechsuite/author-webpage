import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listBooks, createBook } from "@/lib/models/Book";
import { getSession } from "@/lib/auth";

const bookSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().min(1),
  coverImageUrl: z.string().url(),
  previewVideoUrl: z.string().url().optional().or(z.literal("")),
  price: z.number().nonnegative(),
  currency: z.string().default("NGN"),
  format: z.enum(["ebook", "audiobook", "bundle"]),
  fileUrl: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
  featured: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const session = await getSession();
  const publishedOnly = !session; // only admins see unpublished drafts
  const books = await listBooks({ publishedOnly });
  return NextResponse.json({ books });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = bookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const book = await createBook(parsed.data);
  return NextResponse.json({ book }, { status: 201 });
}
