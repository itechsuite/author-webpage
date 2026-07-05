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
          <h1 className="text-5xl uppercase tracking-[0.12em] text-noir md:text-7xl">Shop</h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-lg italic text-noir-muted">
            Ebooks and audiobooks, delivered straight to your inbox after purchase.
          </p>
        </div>
        <BookGrid books={books} />
      </main>
      <Footer />
    </>
  );
}
