import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl, buildObjectKey } from "@/lib/r2";
import { getSession } from "@/lib/auth";

/**
 * Admin requests a signed URL for a specific file, then uploads directly
 * to R2 from the browser with a PUT request. Nothing passes through our
 * server, so this scales fine for large cover images and preview videos.
 *
 * Body: { filename: string, contentType: string, folder: "covers" | "previews" | "files" }
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename, contentType, folder } = await req.json();

  if (!filename || !contentType || !folder) {
    return NextResponse.json({ error: "filename, contentType and folder are required" }, { status: 400 });
  }

  const key = buildObjectKey(folder, filename);
  const { uploadUrl, publicUrl } = await getPresignedUploadUrl(key, contentType);

  return NextResponse.json({ uploadUrl, publicUrl, key });
}
