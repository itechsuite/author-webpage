import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeading from "@/components/PageHeading";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: `Contact — ${process.env.NEXT_PUBLIC_SITE_NAME || "Author"}`,
};

const details = [
  { label: "General & Press", value: "chiroihuoma@gmail.com", href: "mailto:chiroihuoma@gmail.com" },
  { label: "Representation", value: "Your Literary Agency" },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeading
          title="Contact"
          intro="Questions, invitations, or just a hello — the door is open."
        />

        <section className="section grid grid-cols-1 gap-16 !pt-16 md:grid-cols-[0.8fr_1.2fr]">
          {/* Details */}
          <div className="space-y-8">
            {details.map((d) => (
              <div key={d.label}>
                <p className="font-serif text-xs uppercase tracking-[0.2em] text-noir-muted">
                  {d.label}
                </p>
                {d.href ? (
                  <a
                    href={d.href}
                    className="mt-2 block font-display text-2xl text-noir transition-colors hover:text-accent"
                  >
                    {d.value}
                  </a>
                ) : (
                  <p className="mt-2 font-display text-2xl text-noir">{d.value}</p>
                )}
              </div>
            ))}
            <p className="max-w-xs font-serif text-base italic leading-relaxed text-noir-muted">
              I answer personally, so replies may take a few days — thank you for
              your patience.
            </p>
          </div>

          {/* Form */}
          <div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
