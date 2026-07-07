import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { updateAdminRole, setAdminActive, getAdminByEmail } from "@/lib/models/Admin";

const patchSchema = z.object({
  role: z.enum(["super_admin", "store_manager", "content_editor", "support"]).optional(),
  active: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageAdmins")) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { id } = await params;

  // A super_admin can't demote or deactivate their own account — avoids
  // ever locking every admin out of team management.
  const selfAdmin = session?.email ? await getAdminByEmail(session.email) : null;
  if (selfAdmin && selfAdmin._id?.toString() === id) {
    return NextResponse.json({ error: "You can't change your own role or status" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.role) await updateAdminRole(id, parsed.data.role);
  if (typeof parsed.data.active === "boolean") await setAdminActive(id, parsed.data.active);

  return NextResponse.json({ success: true });
}
