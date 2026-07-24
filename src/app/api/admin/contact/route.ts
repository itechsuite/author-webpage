import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { listContactThreads } from "@/lib/models/ContactThread";

export async function GET() {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageContact")) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const threads = await listContactThreads();
  return NextResponse.json({ threads });
}
