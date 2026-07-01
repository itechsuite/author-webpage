import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBookBySlug } from "@/lib/models/Book";
import { formatPrice } from "@/lib/format";

export const revalidate = 60;

export default async function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book || !book.published) notFound();

  return (
    <>
      <Navbar />
      <main>
        <div className="section grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[2/3] w-full max-w-sm overflow-hidden rounded-lg border border-ink-700 bg-ink-800 md:max-w-none">
              <Image src={book.coverImageUrl} alt={book.title} fill className="object-cover" priority />
            </div>

            {book.images && book.images.length > 0 && (
              <div className="flex gap-3 overflow-x-auto">
                {book.images.map((src, i) => (
                  <div
                    key={src}
                    className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md border border-ink-700 bg-ink-800"
                  >
                    <Image src={src} alt={`${book.title} — image ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-cream-50 md:text-5xl">{book.title}</h1>
              {book.subtitle && <p className="mt-3 font-serif text-lg text-cream-50/60">{book.subtitle}</p>}
            </div>

            <p className="whitespace-pre-line font-serif text-lg leading-relaxed text-cream-50/85">{book.description}</p>

            {book.previewVideoUrl && (
              <video controls className="w-full rounded-lg border border-ink-700" src={book.previewVideoUrl} />
            )}

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 font-serif text-sm text-cream-50/85">
              {book.genre && (
                <>
                  <dt className="text-cream-50/50">Genre</dt>
                  <dd>{book.genre}</dd>
                </>
              )}
              {book.language && (
                <>
                  <dt className="text-cream-50/50">Language</dt>
                  <dd>{book.language}</dd>
                </>
              )}
              {book.pageCount && (
                <>
                  <dt className="text-cream-50/50">Length</dt>
                  <dd>{book.pageCount} pages</dd>
                </>
              )}
              {book.publishedDate && (
                <>
                  <dt className="text-cream-50/50">Published</dt>
                  <dd>{book.publishedDate}</dd>
                </>
              )}
              {book.isbn && (
                <>
                  <dt className="text-cream-50/50">ISBN</dt>
                  <dd>{book.isbn}</dd>
                </>
              )}
            </dl>

            {book.tags && book.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-ink-700 bg-ink-800 px-3 py-1 font-display text-xs uppercase tracking-wide text-cream-50/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center gap-6">
              <span className="text-3xl font-bold text-accent">
                {formatPrice(book.price, book.currency)}
              </span>
              {/* Wire this button up to your payment processor of choice
                  (Stripe Checkout, Lemon Squeezy, Paddle, etc). This form
                  posts to a placeholder route you can replace. */}
              <form action="/api/checkout" method="POST">
                <input type="hidden" name="bookId" value={book._id} />
                <button type="submit" className="btn-accent">
                  Buy Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
