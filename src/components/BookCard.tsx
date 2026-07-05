import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/types/book";
import { formatPrice } from "@/lib/format";

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/books/${book.slug}`} className="group flex flex-col text-center">
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-linen-100">
        <Image
          src={book.coverImageUrl}
          alt={book.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col items-center gap-1 pt-5">
        <h3 className="font-display text-2xl leading-tight text-noir transition-colors group-hover:text-accent">
          {book.title}
        </h3>
        {book.subtitle && (
          <p className="font-serif text-sm italic text-noir-muted">{book.subtitle}</p>
        )}
        <span className="mt-2 font-serif text-base text-accent">
          {formatPrice(book.price, book.currency)}
        </span>
      </div>
    </Link>
  );
}
