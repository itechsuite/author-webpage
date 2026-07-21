import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { getSiteSettings, updateSiteSettings } from "@/lib/models/SiteSettings";

const schema = z.object({
  socialLinksVisible: z.boolean().optional(),
});

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageSocialLinks")) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const settings = await updateSiteSettings(parsed.data);
  return NextResponse.json({ settings });
}
