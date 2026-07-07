import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const result = await verifyAdminCredentials(email, password);
  if (!result.ok || !result.role) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createSessionToken(email, result.role);
  await setSessionCookie(token);

  return NextResponse.json({ success: true });
}
