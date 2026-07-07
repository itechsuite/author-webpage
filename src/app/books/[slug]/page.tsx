import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBookBySlug, getBookFileKey } from "@/lib/models/Book";
import { formatPrice } from "@/lib/format";
import { stripe } from "@/lib/stripe";
import { getPresignedDownloadUrl } from "@/lib/r2";

const DOWNLOAD_LINK_EXPIRY_SECONDS = 60 * 60 * 2; // 2 hours

export const revalidate = 0;

async function getDownloadUrl(book: Awaited<ReturnType<typeof getBookBySlug>>, sessionId?: string) {
  if (!book || !sessionId) return null;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paidForThisBook =
      session.payment_status === "paid" && session.metadata?.bookId === book._id;
    if (!paidForThisBook) return null;

    const fileKey = await getBookFileKey(book._id!);
    if (!fileKey) return "pending"; // paid, but no file uploaded yet

    return getPresignedDownloadUrl(fileKey, DOWNLOAD_LINK_EXPIRY_SECONDS);
  } catch {
    return null;
  }
}

export default async function BookDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ checkout?: string; session_id?: string }>;
}) {
  const { slug } = await params;
  const { checkout, session_id: sessionId } = await searchParams;
  const book = await getBookBySlug(slug);

  if (!book || !book.published) notFound();

  const downloadUrl = checkout === "success" ? await getDownloadUrl(book, sessionId) : null;

  return (
    <>
      <Navbar />
      <main>
        <div className="section grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[2/3] w-full max-w-md overflow-hidden bg-linen-100 md:max-w-none">
              <Image src={book.coverImageUrl} alt={book.title} fill className="object-cover" priority />
            </div>

            {book.images && book.images.length > 0 && (
              <div className="flex gap-3 overflow-x-auto">
                {book.images.map((src, i) => (
                  <div
                    key={src}
                    className="relative h-24 w-16 shrink-0 overflow-hidden border border-linen-200 bg-linen-100"
                  >
                    <Image src={src} alt={`${book.title} — image ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl uppercase leading-tight tracking-[0.06em] text-noir md:text-6xl">{book.title}</h1>
              {book.subtitle && <p className="mt-4 font-serif text-lg italic text-noir-muted">{book.subtitle}</p>}
            </div>

            <p className="whitespace-pre-line font-serif text-lg leading-relaxed text-noir/80">{book.description}</p>

            {book.previewVideoUrl && (
              <video controls className="w-full border border-linen-200" src={book.previewVideoUrl} />
            )}

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-linen-200 pt-6 font-serif text-sm text-noir/80">
              {book.genre && (
                <>
                  <dt className="uppercase tracking-wide text-noir-muted">Genre</dt>
                  <dd>{book.genre}</dd>
                </>
              )}
              {book.language && (
                <>
                  <dt className="uppercase tracking-wide text-noir-muted">Language</dt>
                  <dd>{book.language}</dd>
                </>
              )}
              {book.pageCount && (
                <>
                  <dt className="uppercase tracking-wide text-noir-muted">Length</dt>
                  <dd>{book.pageCount} pages</dd>
                </>
              )}
              {book.publishedDate && (
                <>
                  <dt className="uppercase tracking-wide text-noir-muted">Published</dt>
                  <dd>{book.publishedDate}</dd>
                </>
              )}
              {book.isbn && (
                <>
                  <dt className="uppercase tracking-wide text-noir-muted">ISBN</dt>
                  <dd>{book.isbn}</dd>
                </>
              )}
            </dl>

            {book.tags && book.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-linen-200 px-3 py-1 font-serif text-xs uppercase tracking-wide text-noir-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {checkout === "success" && (
              <div className="border-l-2 border-accent bg-linen-50 p-6">
                {downloadUrl === "pending" ? (
                  <>
                    <p className="font-display text-xl text-accent">Payment received.</p>
                    <p className="mt-2 font-serif text-sm text-noir-muted">
                      Your download will be available shortly — we'll be in touch.
                    </p>
                  </>
                ) : downloadUrl ? (
                  <>
                    <p className="font-display text-xl text-accent">Thank you for your purchase!</p>
                    <a href={downloadUrl} className="btn-accent mt-4 inline-block">
                      Download {book.title}
                    </a>
                    <p className="mt-2 font-serif text-xs italic text-noir-muted">
                      This link expires in 2 hours — we've also emailed you a copy.
                    </p>
                  </>
                ) : (
                  <p className="font-serif text-sm text-noir-muted">
                    We couldn't verify that payment yet. If you were just charged, please refresh
                    this page in a moment.
                  </p>
                )}
              </div>
            )}

            {checkout === "cancelled" && (
              <p className="font-serif text-sm italic text-noir-muted">
                Checkout was cancelled — no charge was made.
              </p>
            )}

            <div className="mt-4 flex items-center gap-8">
              <span className="font-display text-4xl text-accent">
                {formatPrice(book.price, book.currency)}
              </span>
              <form action="/api/checkout" method="POST">
                <input type="hidden" name="bookId" value={book._id} />
                <button type="submit" className="btn-accent">
                  Buy Now
                </button>
              </form>
            </div>

            {book.externalSources && book.externalSources.length > 0 && (
              <div className="border-t border-linen-200 pt-6">
                <p className="font-serif text-xs uppercase tracking-[0.2em] text-noir-muted">
                  Also Available On
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {book.externalSources.map((s) => (
                    <a
                      key={s.source}
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-linen-200 px-4 py-1.5 font-serif text-sm text-noir/80 transition-colors hover:border-accent hover:text-accent"
                    >
                      {s.source}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
