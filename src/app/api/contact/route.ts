import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createContactThread } from "@/lib/models/ContactThread";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const thread = await createContactThread(parsed.data);
  return NextResponse.json({ thread }, { status: 201 });
}
