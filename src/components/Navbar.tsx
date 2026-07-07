import Link from "next/link";
import { listSocialLinks } from "@/lib/models/SocialLink";
import type { SocialPlatform } from "@/types/socialLink";

const links = [
  { href: "/books", label: "Books" },
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

const ICON_PATHS: Record<SocialPlatform, string> = {
  instagram:
    "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.8s0 3.5-.1 4.8c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.5.1-4.8c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2m0 5.6A4.2 4.2 0 1 0 16.2 12 4.2 4.2 0 0 0 12 7.8m0 6.9A2.7 2.7 0 1 1 14.7 12 2.7 2.7 0 0 1 12 14.7m5.4-7.1a1 1 0 1 1-1-1 1 1 0 0 1 1 1",
  youtube:
    "M23 7.5a3 3 0 0 0-2.1-2.1C19 4.9 12 4.9 12 4.9s-7 0-8.9.5A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.5 31 31 0 0 0-.5-4.5M9.8 15.3V8.7l5.7 3.3z",
  twitter:
    "M22 5.9c-.7.3-1.5.5-2.3.6a4 4 0 0 0 1.8-2.2c-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.8 3.6A11.3 11.3 0 0 1 3.6 4.7a4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.8-.5a4 4 0 0 0 3.2 3.9c-.5.2-1.1.2-1.7.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18.1a11.3 11.3 0 0 0 6.1 1.8c7.3 0 11.4-6.1 11.4-11.4v-.5A8 8 0 0 0 22 5.9",
  facebook:
    "M14.5 21v-7.8h2.6l.4-3h-3v-1.9c0-.9.2-1.5 1.5-1.5h1.6V4.1C17.3 4 16.3 4 15.2 4c-2.4 0-4 1.5-4 4.1v2.1H8.6v3h2.6V21z",
  tiktok:
    "M16.7 2h-3.1v13.4a2.9 2.9 0 1 1-2-2.7v-3.2a6 6 0 1 0 5.1 5.9V8.6a7.6 7.6 0 0 0 4.4 1.4V6.9a4.5 4.5 0 0 1-4.4-4.4Z",
  pinterest:
    "M12 2.2A9.8 9.8 0 0 0 8.4 21c0-.8 0-1.9.3-2.7l1.4-6s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.5.7 1.5 1.6 0 1-.6 2.4-1 3.8-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-2.3 3.1-5 0-2.1-1.5-3.6-4.1-3.6-3 0-4.8 2.2-4.8 4.6 0 .8.3 1.4.7 1.9.2.2.2.3.1.5l-.3 1c0 .2-.2.3-.4.1-1.1-.5-1.7-1.9-1.7-3.5 0-2.9 2.4-6.3 7.2-6.3 3.8 0 6.4 2.7 6.4 5.7 0 3.9-2.1 6.7-5.1 6.7-1 0-2-.6-2.3-1.2l-.7 2.5a10 10 0 0 1-2 3.6 9.8 9.8 0 0 0 3 .5 9.8 9.8 0 0 0 0-19.6Z",
  linkedin:
    "M6.9 8.6H3.6V20h3.3ZM5.3 3.5A1.9 1.9 0 1 0 5.3 7.3 1.9 1.9 0 0 0 5.3 3.5M20.5 20v-6.4c0-3.4-1.8-5-4.3-5a3.7 3.7 0 0 0-3.3 1.8V8.6H9.5c0 .3 0 8.4 0 11.4h3.3v-6.4c0-.3 0-.7.1-.9.3-.7 1-1.5 2.1-1.5 1.5 0 2.1 1.1 2.1 2.8V20Z",
  other:
    "M10.6 13.4a1 1 0 0 1 0-1.4l3-3a3 3 0 1 1 4.2 4.2l-1.6 1.6a1 1 0 1 1-1.4-1.4l1.6-1.6a1 1 0 1 0-1.4-1.4l-3 3a1 1 0 0 1-1.4 0M13.4 10.6a1 1 0 0 1 0 1.4l-3 3a3 3 0 1 1-4.2-4.2l1.6-1.6a1 1 0 1 1 1.4 1.4l-1.6 1.6a1 1 0 1 0 1.4 1.4l3-3a1 1 0 0 1 1.4 0",
};

export default async function Navbar() {
  const socials = await listSocialLinks();

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

          {socials.length > 0 && (
            <div className="flex items-center gap-4 text-noir/70">
              {socials.map((s) => (
                <a
                  key={s._id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform === "other" ? s.label || "Social link" : s.platform}
                  className="transition-colors hover:text-accent"
                >
                  <Icon path={ICON_PATHS[s.platform]} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
