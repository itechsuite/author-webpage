"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUploader from "./FileUploader";
import type { Book } from "@/types/book";

interface Props {
  book?: Book; // when present, form is in "edit" mode
}

export default function BookForm({ book }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: book?.title || "",
    subtitle: book?.subtitle || "",
    description: book?.description || "",
    coverImageUrl: book?.coverImageUrl || "",
    previewVideoUrl: book?.previewVideoUrl || "",
    fileUrl: book?.fileUrl || "",
    price: book?.price ?? 5000,
    currency: book?.currency || "NGN",
    format: book?.format || "ebook",
    published: book?.published ?? false,
    featured: book?.featured ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = book ? `/api/books/${book._id}` : "/api/books";
    const method = book ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(JSON.stringify(data.error) || "Something went wrong");
      return;
    }

    router.push("/admin/books");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <label className="text-sm text-cream-50/70">Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full rounded-md border border-white/10 bg-ink-950 px-4 py-2 text-cream-50 focus:border-accent focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-cream-50/70">Subtitle</label>
        <input
          value={form.subtitle}
          onChange={(e) => update("subtitle", e.target.value)}
          className="w-full rounded-md border border-white/10 bg-ink-950 px-4 py-2 text-cream-50 focus:border-accent focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-cream-50/70">Description</label>
        <textarea
          required
          rows={5}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full rounded-md border border-white/10 bg-ink-950 px-4 py-2 text-cream-50 focus:border-accent focus:outline-none"
        />
      </div>

      <FileUploader
        label="Cover Image"
        folder="covers"
        accept="image/*"
        value={form.coverImageUrl}
        onUploaded={(url) => update("coverImageUrl", url)}
      />

      <FileUploader
        label="Preview Video (optional)"
        folder="previews"
        accept="video/*"
        value={form.previewVideoUrl}
        onUploaded={(url) => update("previewVideoUrl", url)}
      />

      <FileUploader
        label="Deliverable File (ebook/audiobook, delivered after purchase)"
        folder="files"
        accept=".pdf,.epub,.mp3,.zip"
        value={form.fileUrl}
        onUploaded={(url) => update("fileUrl", url)}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-cream-50/70">Price</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => update("price", parseFloat(e.target.value))}
            className="w-full rounded-md border border-white/10 bg-ink-950 px-4 py-2 text-cream-50 focus:border-accent focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-cream-50/70">Currency</label>
          <input
            value={form.currency}
            onChange={(e) => update("currency", e.target.value)}
            className="w-full rounded-md border border-white/10 bg-ink-950 px-4 py-2 text-cream-50 focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-cream-50/70">Format</label>
        <select
          value={form.format}
          onChange={(e) => update("format", e.target.value as typeof form.format)}
          className="w-full rounded-md border border-white/10 bg-ink-950 px-4 py-2 text-cream-50 focus:border-accent focus:outline-none"
        >
          <option value="ebook">Ebook</option>
          <option value="audiobook">Audiobook</option>
          <option value="bundle">Bundle</option>
        </select>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-cream-50/70">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => update("published", e.target.checked)}
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm text-cream-50/70">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
          />
          Featured on homepage
        </label>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button type="submit" disabled={saving} className="btn-accent">
        {saving ? "Saving..." : book ? "Save Changes" : "Create Book"}
      </button>
    </form>
  );
}
