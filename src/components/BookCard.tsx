import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/types/book";
import { formatPrice } from "@/lib/format";

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/books/${book.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-ink-700 bg-ink-800 transition-all hover:-translate-y-1 hover:border-accent/60"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-ink-700">
        <Image
          src={book.coverImageUrl}
          alt={book.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {book.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 font-display text-xs font-bold uppercase text-white">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg font-bold text-cream-50">{book.title}</h3>
        {book.subtitle && <p className="font-serif text-sm text-cream-50/60">{book.subtitle}</p>}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-xs font-bold uppercase tracking-wide text-cream-50/50">{book.format}</span>
          <span className="font-display text-lg font-bold text-accent">
            {formatPrice(book.price, book.currency)}
          </span>
        </div>
      </div>
    </Link>
  );
}
