"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Category } from "@/types/category";
import AdminCard from "@/components/admin/AdminCard";

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
    "w-full rounded-lg border border-adminBorder bg-adminBg px-4 py-2 text-white focus:border-adminAccent focus:outline-none";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <Link href="/admin/blog" className="text-adminAccent-soft hover:underline">
          ← Back to Blog
        </Link>
      </div>

      <AdminCard className="max-w-lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-white/60">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/60">Description (optional)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-gradient-to-r from-adminAccent to-adminAccent-violet px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>
      </AdminCard>

      <AdminCard className="!p-0 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-white/50">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Description</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id} className="border-t border-adminBorder">
                <td className="p-4 font-medium text-white">{c.name}</td>
                <td className="p-4 text-white/40">{c.slug}</td>
                <td className="p-4 text-white/70">{c.description || "—"}</td>
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
                <td colSpan={4} className="p-8 text-center text-white/40">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </AdminCard>
    </div>
  );
}
