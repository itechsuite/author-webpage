import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeading from "@/components/PageHeading";
import AuthorPortrait from "@/components/AuthorPortrait";

export const metadata: Metadata = {
  title: `About — ${process.env.NEXT_PUBLIC_SITE_NAME || "Author"}`,
};

const bio =
  "Telling stories is the oldest art form in human history, and to date, it has not lost its ability to entertain, inspire, and expand our imagination. I write stories that inspire readers to overcome challenges and rise above their limitations to reach for greater heights. I also write about God's grace and redemption. My non-fiction books cut across different genres and age groups. I write for adults, young adults, and children.";

export default function AboutPage() {
  const name = process.env.NEXT_PUBLIC_SITE_NAME || "Your Name";

  return (
    <>
      <Navbar />
      <main>
        <PageHeading title="About" />

        <section className="section grid grid-cols-1 gap-14 !pt-14 md:grid-cols-[1.1fr_0.9fr] md:gap-20">
          {/* Bio column */}
          <div className="order-2 md:order-1">
            {/* Spice: oversized decorative drop-cap on the opening line */}
            <p className="font-serif text-lg leading-relaxed text-noir/85 [&::first-letter]:float-left [&::first-letter]:mr-3 [&::first-letter]:mt-1 [&::first-letter]:font-display [&::first-letter]:text-7xl [&::first-letter]:font-medium [&::first-letter]:leading-[0.8] [&::first-letter]:text-accent">
              {bio}
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Link href="/books" className="btn-accent">
                Read the Books
              </Link>
              <Link
                href="/contact"
                className="font-serif text-base italic text-accent underline-offset-4 hover:underline"
              >
                Get in touch →
              </Link>
            </div>

            {/* Spice: handwritten-feel signature */}
            <p className="mt-14 font-display text-3xl italic text-accent">— {name}</p>
          </div>

          {/* Arched, "alive" portrait with an offset accent panel behind it */}
          <AuthorPortrait
            src="https://pub-2f8f7122da514161b38cdfcd7fecfb26.r2.dev/covers/1783127504737-main-author.jpeg"
            alt={`Portrait of ${name}`}
            priority
            className="order-1 mx-auto w-full max-w-sm md:order-2 md:max-w-none"
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
