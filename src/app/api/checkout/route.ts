import { NextRequest, NextResponse } from "next/server";
import { getBookById } from "@/lib/models/Book";
import { getStripe, toStripeAmount } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const bookId = formData.get("bookId") as string;

    const book = await getBookById(bookId);
    if (!book || !book.published) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    if (book.comingSoon) {
      return NextResponse.json({ error: "This book is not available for purchase yet" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: book.currency.toLowerCase(),
            product_data: {
              name: book.title,
              description: book.subtitle || undefined,
              images: book.coverImageUrl ? [book.coverImageUrl] : undefined,
            },
            unit_amount: toStripeAmount(book.price, book.currency),
          },
          quantity: 1,
        },
      ],
      metadata: { bookId: book._id! },
      success_url: `${siteUrl}/books/${book.slug}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/books/${book.slug}?checkout=cancelled`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Could not start checkout" }, { status: 502 });
    }

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    console.error("[/api/checkout]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
