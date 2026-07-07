"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { hasPermission, type Permission } from "@/lib/rbac";
import type { Role } from "@/types/admin";

const links: { href: string; label: string; permission?: Permission }[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/books", label: "Books", permission: "manageBooks" },
  { href: "/admin/orders", label: "Orders", permission: "manageOrders" },
  { href: "/admin/customers", label: "Customers", permission: "manageCustomers" },
  { href: "/admin/blog", label: "Blog", permission: "manageContent" },
  { href: "/admin/social-links", label: "Social Links", permission: "manageSocialLinks" },
  { href: "/admin/team", label: "Team", permission: "manageAdmins" },
];

export default function AdminSidebar({
  email,
  roleLabel,
  role,
}: {
  email: string;
  roleLabel: string;
  role: Role;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const visibleLinks = links.filter((link) => !link.permission || hasPermission(role, link.permission));

  return (
    <aside className="flex w-64 flex-col border-r border-adminBorder bg-adminSurface p-6">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-white">Admin</p>
        <p className="mt-1 truncate text-xs text-white/40">{email}</p>
        <span className="mt-2 inline-block rounded-full bg-adminAccent/15 px-2.5 py-1 text-[11px] font-semibold text-adminAccent-soft">
          {roleLabel}
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {visibleLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-gradient-to-r from-adminAccent to-adminAccent-violet text-white shadow-[0_0_24px_-6px_rgba(76,125,255,0.6)]"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto rounded-xl px-3 py-2 text-left text-sm text-white/40 transition-colors hover:text-white"
      >
        Log Out
      </button>
    </aside>
  );
}
