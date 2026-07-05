import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import BookGrid from "@/components/BookGrid";
import NewsletterSignup from "@/components/NewsletterSignup";
import { listBooks } from "@/lib/models/Book";

export const revalidate = 60;

export default async function HomePage() {
  const books = await listBooks({ publishedOnly: true });
  const featured = books.filter((b) => b.featured);
  const spotlight = featured[0] ?? books[0];
  const toShow = (featured.length > 0 ? featured : books).slice(0, 4);

  return (
    <>
      <Navbar />
      <main>
        <Hero book={spotlight} />
        <hr className="divider-thin" />
        <BookGrid books={toShow} title="Shop" />
        <hr className="divider-thin" />

        <section id="about" className="bg-linen-50/70">
          <div className="section text-center">
            <h2 className="text-gradient mb-8 text-4xl uppercase tracking-[0.15em] md:text-5xl">
              About
            </h2>
            <p className="mx-auto max-w-2xl font-serif text-xl leading-relaxed text-noir-muted">
              A novelist and storyteller writing about families, memory, and the
              quiet truths we carry. New work is always on the way.
            </p>
            <div className="mt-10">
              <Link href="/about" className="btn-outline">
                More About Me
              </Link>
            </div>
          </div>
        </section>

        <NewsletterSignup />
      </main>
      <Footer />
    </>
  );
}
