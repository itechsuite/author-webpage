import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import BookGrid from "@/components/BookGrid";
import NewsletterSignup from "@/components/NewsletterSignup";
import AnimatedDivider from "@/components/AnimatedDivider";
import { listBooks } from "@/lib/models/Book";

export const revalidate = 60;

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Your Name";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function HomePage() {
  const books = await listBooks({ publishedOnly: true });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    publisher: { "@type": "Person", name: siteName },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
