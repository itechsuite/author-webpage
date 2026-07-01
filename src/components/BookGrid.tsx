import type { Book } from "@/types/book";
import BookCard from "./BookCard";

export default function BookGrid({ books, title }: { books: Book[]; title?: string }) {
  if (books.length === 0) {
    return (
      <div className="section text-center font-serif text-cream-50/50">
        No books published yet. Add some from the admin dashboard.
      </div>
    );
  }

  return (
    <section className="section">
      {title && (
        <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-cream-50 md:text-4xl">{title}</h2>
      )}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </section>
  );
}
