import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { updateSocialLink, deleteSocialLink } from "@/lib/models/SocialLink";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageSocialLinks")) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const link = await updateSocialLink(id, body);
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ link });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageSocialLinks")) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { id } = await params;
  const ok = await deleteSocialLink(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
