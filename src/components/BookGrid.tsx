import type { Book } from "@/types/book";
import BookCard from "./BookCard";

export default function BookGrid({ books, title }: { books: Book[]; title?: string }) {
  if (books.length === 0) {
    return (
      <div className="section text-center font-serif text-lg italic text-noir-muted">
        No books published yet. Add some from the admin dashboard.
      </div>
    );
  }

  return (
    <section className="section">
      {title && (
        <h2 className="text-gradient mb-14 text-center text-4xl uppercase tracking-[0.15em] md:text-5xl">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </section>
  );
}
