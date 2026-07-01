import Link from "next/link";

const links = [
  { href: "/books", label: "Books" },
  { href: "/#about", label: "About" },
  { href: "/#newsletter", label: "Newsletter" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-700 bg-ink-900/90 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-xl font-extrabold uppercase tracking-widest text-cream-50"
        >
          {process.env.NEXT_PUBLIC_SITE_NAME || "Your Name"}
        </Link>

        <nav className="hidden gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-sm font-bold uppercase tracking-wide text-cream-50/80 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/books" className="btn-accent">
          Shop Books
        </Link>
      </div>
    </header>
  );
}
