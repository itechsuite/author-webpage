import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import BookGrid from "@/components/BookGrid";
import NewsletterSignup from "@/components/NewsletterSignup";
import AnimatedDivider from "@/components/AnimatedDivider";
import { listBooks } from "@/lib/models/Book";

export const revalidate = 60;

export default async function HomePage() {
  const books = await listBooks({ publishedOnly: true });

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AnimatedDivider />
        <BookGrid books={books} title="Books" />
        <AnimatedDivider />

        <NewsletterSignup />
      </main>
      <Footer />
    </>
  );
}
