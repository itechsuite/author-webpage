import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { listSocialLinks, createSocialLink } from "@/lib/models/SocialLink";

const schema = z.object({
  platform: z.enum([
    "instagram",
    "youtube",
    "twitter",
    "facebook",
    "tiktok",
    "pinterest",
    "linkedin",
    "other",
  ]),
  label: z.string().optional(),
  url: z.string().url(),
  order: z.number().default(0),
});

export async function GET() {
  const links = await listSocialLinks();
  return NextResponse.json({ links });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageSocialLinks")) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const link = await createSocialLink(parsed.data);
  return NextResponse.json({ link }, { status: 201 });
}
