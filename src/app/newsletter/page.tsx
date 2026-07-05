import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeading from "@/components/PageHeading";

export const metadata: Metadata = {
  title: `Newsletter — ${process.env.NEXT_PUBLIC_SITE_NAME || "Author"}`,
};

const perks = [
  {
    title: "New Releases First",
    body: "Cover reveals, pre-orders, and release dates before anyone else.",
  },
  {
    title: "Letters from the Desk",
    body: "Short, honest notes on writing, reading, and the work in progress.",
  },
  {
    title: "Readers-Only Extras",
    body: "Deleted scenes, book recommendations, and the occasional giveaway.",
  },
];

export default function NewsletterPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeading
          title="Newsletter"
          intro="A quiet letter, once in a while — never noise."
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
            <h2 className="text-4xl uppercase tracking-[0.12em] text-noir">Join the List</h2>
            <p className="mt-4 font-serif text-lg italic leading-relaxed text-noir-muted">
              Enter your email below. Unsubscribe anytime — no hard feelings.
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
