import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import BookGrid from "@/components/BookGrid";
import NewsletterSignup from "@/components/NewsletterSignup";
import { listBooks } from "@/lib/models/Book";

export const revalidate = 60;

export default async function HomePage() {
  const books = await listBooks({ publishedOnly: true });

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <hr className="divider-thin" />
        <BookGrid books={books} title="Books" />
        <hr className="divider-thin" />

        <NewsletterSignup />
      </main>
      <Footer />
    </>
  );
}
