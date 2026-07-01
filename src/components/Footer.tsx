import Link from "next/link";

const columns = [
  [
    { href: "/books", label: "Books" },
    { href: "/#about", label: "About" },
    { href: "/#newsletter", label: "Newsletter" },
  ],
  [
    { href: "/books", label: "Shop" },
    { href: "/admin/login", label: "Admin" },
  ],
];

export default function Footer() {
  const name = process.env.NEXT_PUBLIC_SITE_NAME || "Your Name";

  return (
    <footer className="border-t border-ink-700 bg-ink-950">
      <div className="mx-auto max-w-content px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="max-w-md">
            <p className="font-display text-xl font-extrabold uppercase tracking-widest text-cream-50">
              {name}
            </p>
            <p className="mt-5 font-serif leading-relaxed text-cream-50/70">
              Author of stories about family, identity, and the quiet truths we
              carry. New books, essays, and ideas — delivered straight to your
              inbox.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {columns.map((col, i) => (
              <nav key={i} className="flex flex-col gap-3">
                {col.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-display text-sm font-bold uppercase tracking-wide text-cream-50/70 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
        </div>

        <p className="mt-12 font-serif text-xs text-cream-50/40">
          © {new Date().getFullYear()} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
