import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookShowcaseSection from "@/components/BookShowcaseSection";
import { listBooks } from "@/lib/models/Book";

export const revalidate = 60;

export default async function BooksPage() {
  const books = await listBooks({ publishedOnly: true });

  return (
    <>
      <Navbar />
      <main>
        <div className="section text-center !pb-0">
          <h1 className="text-5xl uppercase tracking-[0.12em] text-noir md:text-7xl">Shop</h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-lg italic text-noir-muted">
            Ebooks and audiobooks, delivered straight to your inbox after purchase.
          </p>
        </div>

        {books.length === 0 ? (
          <div className="section text-center font-serif text-lg italic text-noir-muted">
            No books published yet. Add some from the admin dashboard.
          </div>
        ) : (
          <div className="mt-16">
            {books.map((book, index) => (
              <BookShowcaseSection key={book._id} book={book} index={index} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
