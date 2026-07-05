import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listCategories, createCategory } from "@/lib/models/Category";
import { getSession } from "@/lib/auth";

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export async function GET() {
  const categories = await listCategories();
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const category = await createCategory(parsed.data);
  return NextResponse.json({ category }, { status: 201 });
}
