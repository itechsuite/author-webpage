import { NextRequest, NextResponse } from "next/server";
import { getBookById, updateBook, deleteBook } from "@/lib/models/Book";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  const { id } = await params;
  const book = await getBookById(id, { includeSecure: !!session });
  if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ book });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageBooks")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const book = await updateBook(id, body);
  if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ book });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageBooks")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ok = await deleteBook(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
