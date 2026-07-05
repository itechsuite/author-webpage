"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Category } from "@/types/category";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.categories || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(JSON.stringify(data.error) || "Something went wrong");
      return;
    }

    setName("");
    setDescription("");
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? Posts using it will keep the old slug as plain text.")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    load();
  }

  const inputClass =
    "w-full rounded-md border border-white/10 bg-ink-950 px-4 py-2 text-cream-50 focus:border-accent focus:outline-none";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link href="/admin/blog" className="text-accent hover:underline">
          ← Back to Blog
        </Link>
      </div>

      <form onSubmit={handleCreate} className="max-w-lg space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-cream-50/70">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-cream-50/70">Description (optional)</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={loading} className="btn-accent">
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-900 text-cream-50/50">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Description</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id} className="border-t border-white/10">
                <td className="p-4 font-medium">{c.name}</td>
                <td className="p-4 text-cream-50/50">{c.slug}</td>
                <td className="p-4 text-cream-50/70">{c.description || "—"}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(c._id!)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-cream-50/40">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
