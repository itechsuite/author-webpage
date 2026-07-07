import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeading from "@/components/PageHeading";

export const metadata: Metadata = {
  title: `Newsletter — ${process.env.NEXT_PUBLIC_SITE_NAME || "Author"}`,
};

const perks = [
  {
    title: "Two Minutes, Once in a While",
    body: "A short, focused inspirational note — nothing long, nothing that eats your day.",
  },
  {
    title: "Encouragement That Lasts",
    body: "Stories and reminders meant to help you overcome challenges and rise above your limitations.",
  },
  {
    title: "Straight From the Source",
    body: "The same reflections that appear on the blog, delivered directly to your inbox.",
  },
];

export default function NewsletterPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeading
          title="Newsletter"
          intro=" Newsletter — a quiet, inspirational note, once in a while."
        />

        <section className="section grid grid-cols-1 gap-16 !pt-16 md:grid-cols-2">
          {/* Perks */}
          <div className="space-y-10">
            {perks.map((p, i) => (
              <div key={p.title} className="flex gap-6">
                <span className="font-display text-4xl leading-none text-accent/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-2xl text-noir">{p.title}</h3>
                  <p className="mt-2 font-serif text-lg leading-relaxed text-noir-muted">
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Signup card */}
          <div className="flex flex-col justify-center bg-linen-50 p-10 md:p-14">
            <h2 className="text-4xl uppercase tracking-[0.12em] text-noir">
              Newsletter
            </h2>
            <p className="mt-4 font-serif text-lg italic leading-relaxed text-noir-muted">
              Enter your email below to sign up for my free
              Newsletter. It is just a two-minute inspirational note that
              will impact your life.
            </p>

            <form className="mt-8 flex flex-col gap-4">
              <input
                type="text"
                placeholder="First name"
                className="border-b border-noir/30 bg-transparent px-2 py-3 font-serif text-base text-noir placeholder:text-noir-muted focus:border-accent focus:outline-none"
              />
              <input
                type="email"
                required
                placeholder="Email address"
                className="border-b border-noir/30 bg-transparent px-2 py-3 font-serif text-base text-noir placeholder:text-noir-muted focus:border-accent focus:outline-none"
              />
              <button type="submit" className="btn-accent mt-4 self-start">
                Subscribe
              </button>
            </form>

            <p className="mt-6 font-serif text-sm italic text-noir-muted">
              No spam, ever. Your details stay private.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
