import Link from "next/link";

const footerLinks = [
  { href: "/books", label: "Books" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/contact", label: "Contact" },
  { href: "/admin/login", label: "Admin" },
];

// More retailers can be appended here as the author provides them
// (e.g. Barnes & Noble). TODO: replace "#" with the real Amazon author/book link.
const retailers = [{ label: "Amazon", href: "#" }];

export default function Footer() {
  const name = process.env.NEXT_PUBLIC_SITE_NAME || "Your Name";

  return (
    <footer className="border-t border-white/10 bg-noir">
      <div className="mx-auto flex max-w-content flex-col items-center gap-8 px-6 py-16 text-center">
        <Link href="/" className="font-display text-3xl font-medium tracking-wide text-white">
          {name}
        </Link>

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-serif text-sm uppercase tracking-[0.15em] text-cream-50/70 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="font-serif text-xs italic text-cream-50/40">
          © {new Date().getFullYear()} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  
  );
}
