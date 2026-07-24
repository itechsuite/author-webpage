import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { getContactThreadById, addThreadMessage } from "@/lib/models/ContactThread";
import { sendContactReplyEmail } from "@/lib/email";

const schema = z.object({
  body: z.string().min(1),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageContact")) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { id } = await params;
  const parsedBody = await req.json();
  const parsed = schema.safeParse(parsedBody);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const thread = await getContactThreadById(id);
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  try {
    await sendContactReplyEmail({
      to: thread.email,
      customerName: thread.name,
      subject: thread.subject,
      replyBody: parsed.data.body,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const updated = await addThreadMessage(id, {
    from: "admin",
    body: parsed.data.body,
    createdAt: new Date().toISOString(),
    adminEmail: session!.email,
  });

  return NextResponse.json({ thread: updated });
}
