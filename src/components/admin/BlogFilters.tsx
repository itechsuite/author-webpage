"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Category } from "@/types/category";

export default function BlogFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  const selectClass =
    "rounded-md border border-white/10 bg-ink-950 px-3 py-2 text-sm text-cream-50 focus:border-accent focus:outline-none";

  return (
    <div className="flex gap-3">
      <select
        className={selectClass}
        value={searchParams.get("status") || ""}
        onChange={(e) => setParam("status", e.target.value)}
      >
        <option value="">All statuses</option>
        <option value="draft">Draft</option>
        <option value="scheduled">Scheduled</option>
        <option value="published">Published</option>
      </select>

      <select
        className={selectClass}
        value={searchParams.get("category") || ""}
        onChange={(e) => setParam("category", e.target.value)}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c._id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
