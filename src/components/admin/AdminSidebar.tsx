"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/books", label: "Books" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="flex w-56 flex-col border-r border-white/10 bg-ink-900 p-6">
      <p className="mb-8 text-sm font-bold uppercase tracking-widest text-cream-50/60">
        Admin
      </p>

      <nav className="flex flex-1 flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-accent text-ink-950"
                : "text-cream-50/70 hover:bg-ink-800 hover:text-cream-50"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto rounded-md px-3 py-2 text-left text-sm text-cream-50/50 transition-colors hover:text-cream-50"
      >
        Log Out
      </button>
    </aside>
  );
}
