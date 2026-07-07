import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { listAdmins, createAdmin, getAdminByEmail } from "@/lib/models/Admin";

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["super_admin", "store_manager", "content_editor", "support"]),
});

export async function GET() {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageAdmins")) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const admins = await listAdmins();
  return NextResponse.json({ admins });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageAdmins")) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await getAdminByEmail(parsed.data.email);
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const admin = await createAdmin(parsed.data.email, parsed.data.password, parsed.data.role);
  return NextResponse.json({ admin }, { status: 201 });
}
