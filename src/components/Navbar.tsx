import Link from "next/link";

const links = [
  { href: "/books", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/contact", label: "Contact" },
];

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const socials = [
  {
    label: "Instagram",
    href: "#",
    path: "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.8s0 3.5-.1 4.8c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.5.1-4.8c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2m0 5.6A4.2 4.2 0 1 0 16.2 12 4.2 4.2 0 0 0 12 7.8m0 6.9A2.7 2.7 0 1 1 14.7 12 2.7 2.7 0 0 1 12 14.7m5.4-7.1a1 1 0 1 1-1-1 1 1 0 0 1 1 1",
  },
  {
    label: "YouTube",
    href: "#",
    path: "M23 7.5a3 3 0 0 0-2.1-2.1C19 4.9 12 4.9 12 4.9s-7 0-8.9.5A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.5 31 31 0 0 0-.5-4.5M9.8 15.3V8.7l5.7 3.3z",
  },
  {
    label: "Twitter",
    href: "#",
    path: "M22 5.9c-.7.3-1.5.5-2.3.6a4 4 0 0 0 1.8-2.2c-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.8 3.6A11.3 11.3 0 0 1 3.6 4.7a4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.8-.5a4 4 0 0 0 3.2 3.9c-.5.2-1.1.2-1.7.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18.1a11.3 11.3 0 0 0 6.1 1.8c7.3 0 11.4-6.1 11.4-11.4v-.5A8 8 0 0 0 22 5.9",
  },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-linen-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-content flex-col items-center gap-4 px-6 py-6 md:flex-row md:justify-between md:gap-8">
        <Link
          href="/"
          className="font-display text-3xl font-medium tracking-wide text-accent"
        >
          {process.env.NEXT_PUBLIC_SITE_NAME || "Your Name"}
        </Link>

        <div className="flex items-center gap-8">
          <nav className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-serif text-base text-noir/80 transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 text-noir/70">
            {socials.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} className="transition-colors hover:text-accent">
                <Icon path={s.path} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
