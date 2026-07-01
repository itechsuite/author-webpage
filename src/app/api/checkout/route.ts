import { NextRequest, NextResponse } from "next/server";
import { getBookById } from "@/lib/models/Book";

/**
 * Placeholder checkout endpoint. Replace this with a real integration:
 *
 *   Stripe:    create a Checkout Session with book.price and redirect to it.
 *   Lemon Squeezy / Paddle: similar pattern via their hosted checkout.
 *
 * For now this just confirms the book exists and echoes back a message so
 * the "Buy Now" flow is wired end-to-end and ready for a processor.
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const bookId = formData.get("bookId") as string;

  const book = await getBookById(bookId);
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  return NextResponse.redirect(new URL(`/books/${book.slug}?checkout=pending`, req.url));
}
