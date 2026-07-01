import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import BookGrid from "@/components/BookGrid";
import NewsletterSignup from "@/components/NewsletterSignup";
import { listBooks } from "@/lib/models/Book";

export const revalidate = 60;

export default async function HomePage() {
  const books = await listBooks({ publishedOnly: true });
  const featured = books.filter((b) => b.featured).slice(0, 4);
  const toShow = featured.length > 0 ? featured : books.slice(0, 4);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <hr className="divider-dotted" />
        <BookGrid books={toShow} title="My Books" />
        <hr className="divider-dotted" />

        <section id="about">
          <div className="section text-center">
            <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-cream-50 md:text-4xl">
              About Me
            </h2>
            <p className="mx-auto max-w-2xl font-serif text-lg leading-relaxed text-cream-50/80">
              Add your bio here — where you&apos;re from, what you write about, and
              why readers should trust you. Keep it short; the books do the
              talking.
            </p>
          </div>
        </section>

        <NewsletterSignup />
      </main>
      <Footer />
    </>
  );
}
