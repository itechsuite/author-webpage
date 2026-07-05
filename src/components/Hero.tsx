import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/types/book";

export default function Hero({ book }: { book?: Book }) {
  // Featured book takes the spotlight (cover left, details right). If there is
  // no book yet, fall back to a simple author introduction.
  if (!book) {
    return (
      <section className="section text-center">
        <h1 className="text-4xl font-medium tracking-wide text-noir md:text-6xl">
          {process.env.NEXT_PUBLIC_SITE_NAME || "Your Name"}
        </h1>
        <p className="mx-auto mt-6 max-w-xl font-serif text-lg italic leading-relaxed text-noir-muted">
          Books, stories, and writings. New work coming soon.
        </p>
      </section>
    );
  }

  return (
    <section className="section grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
      <div className="relative mx-auto aspect-[2/3] w-full max-w-md overflow-hidden md:mx-0">
        <Image src={book.coverImageUrl} alt={book.title} fill className="object-cover" priority />
      </div>

      <div className="flex flex-col">
        <h1 className="text-5xl uppercase leading-[1.05] tracking-[0.06em] text-noir md:text-7xl">
          {book.title}
        </h1>

        <p className="mt-8 max-w-md font-serif text-lg italic leading-relaxed text-noir/80">
          {book.description}
        </p>

        {book.publishedDate && (
          <p className="mt-10 font-display text-2xl italic tracking-wide text-accent md:text-3xl">
            {formatReleaseLine(book.publishedDate)}
          </p>
        )}

        <div className="mt-8">
          <Link href={`/books/${book.slug}`} className="btn-accent">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}

function formatReleaseLine(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  return d.getTime() > Date.now() ? `Coming ${label}` : `Available Now`;
}
