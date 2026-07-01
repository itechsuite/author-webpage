import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookGrid from "@/components/BookGrid";
import { listBooks } from "@/lib/models/Book";

export const revalidate = 60;

export default async function BooksPage() {
  const books = await listBooks({ publishedOnly: true });

  return (
    <>
      <Navbar />
      <main>
        <div className="section text-center !pb-0">
          <h1 className="text-5xl font-extrabold tracking-tight text-cream-50 md:text-6xl">Books</h1>
          <p className="mt-5 font-serif text-lg text-cream-50/70">
            Ebooks and audiobooks, delivered straight to your inbox after purchase.
          </p>
        </div>
        <BookGrid books={books} />
      </main>
      <Footer />
    </>
  );
}
