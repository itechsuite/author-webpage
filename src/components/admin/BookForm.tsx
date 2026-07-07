"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUploader from "./FileUploader";
import type { Book, ExternalSource } from "@/types/book";

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
    fullBookCoverUrl: book?.fullBookCoverUrl || "",
    previewVideoUrl: book?.previewVideoUrl || "",
    bookFileKey: book?.bookFileKey || "",
    price: book?.price ?? 5000,
    currency: book?.currency || "NGN",
    format: book?.format || "ebook",
    published: book?.published ?? false,
    featured: book?.featured ?? false,
    externalSources: book?.externalSources ?? [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateSource(index: number, key: keyof ExternalSource, value: string) {
    setForm((prev) => ({
      ...prev,
      externalSources: prev.externalSources.map((s, i) =>
        i === index ? { ...s, [key]: value } : s
      ),
    }));
  }

  function addSource() {
    setForm((prev) => ({
      ...prev,
      externalSources: [...prev.externalSources, { source: "", link: "" }],
    }));
  }

  function removeSource(index: number) {
    setForm((prev) => ({
      ...prev,
      externalSources: prev.externalSources.filter((_, i) => i !== index),
    }));
  }

  function moveSource(index: number, direction: -1 | 1) {
    setForm((prev) => {
      const next = [...prev.externalSources];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, externalSources: next };
    });
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
        <label className="text-sm text-white/60">Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full rounded-md border border-adminBorder bg-adminBg px-4 py-2 text-white focus:border-adminAccent focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/60">Subtitle</label>
        <input
          value={form.subtitle}
          onChange={(e) => update("subtitle", e.target.value)}
          className="w-full rounded-md border border-adminBorder bg-adminBg px-4 py-2 text-white focus:border-adminAccent focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/60">Description</label>
        <textarea
          required
          rows={5}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full rounded-md border border-adminBorder bg-adminBg px-4 py-2 text-white focus:border-adminAccent focus:outline-none"
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
        label="Full Book Cover (uncropped front + spine + back)"
        folder="covers"
        accept="image/*"
        value={form.fullBookCoverUrl}
        onUploaded={(url) => update("fullBookCoverUrl", url)}
      />

      <FileUploader
        label="Preview Video (optional)"
        folder="previews"
        accept="video/*"
        value={form.previewVideoUrl}
        onUploaded={(url) => update("previewVideoUrl", url)}
      />

      <FileUploader
        label="Deliverable File (ebook/audiobook — stored securely, never public)"
        folder="secure"
        accept=".pdf,.epub,.mp3,.zip"
        value={form.bookFileKey}
        onUploaded={(key) => update("bookFileKey", key)}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-white/60">Price</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => update("price", parseFloat(e.target.value))}
            className="w-full rounded-md border border-adminBorder bg-adminBg px-4 py-2 text-white focus:border-adminAccent focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/60">Currency</label>
          <input
            value={form.currency}
            onChange={(e) => update("currency", e.target.value)}
            className="w-full rounded-md border border-adminBorder bg-adminBg px-4 py-2 text-white focus:border-adminAccent focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/60">Format</label>
        <select
          value={form.format}
          onChange={(e) => update("format", e.target.value as typeof form.format)}
          className="w-full rounded-md border border-adminBorder bg-adminBg px-4 py-2 text-white focus:border-adminAccent focus:outline-none"
        >
          <option value="ebook">Ebook</option>
          <option value="audiobook">Audiobook</option>
          <option value="bundle">Bundle</option>
        </select>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-white/60">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => update("published", e.target.checked)}
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm text-white/60">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
          />
          Featured on homepage
        </label>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm text-white/60">
            External Sources (Amazon, Barnes &amp; Noble, etc.)
          </label>
          <button
            type="button"
            onClick={addSource}
            className="rounded-md border border-adminBorder px-3 py-1 text-xs uppercase tracking-wide text-white/60 transition-colors hover:border-adminAccent hover:text-adminAccent-soft"
          >
            + Add Source
          </button>
        </div>

        {form.externalSources.length === 0 && (
          <p className="text-xs italic text-white/30">No external sources added yet.</p>
        )}

        <div className="space-y-3">
          {form.externalSources.map((s, i) => (
            <div key={i} className="flex items-start gap-2 rounded-md border border-adminBorder p-3">
              <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  required
                  placeholder="Source name (e.g. Amazon)"
                  value={s.source}
                  onChange={(e) => updateSource(i, "source", e.target.value)}
                  className="w-full rounded-md border border-adminBorder bg-adminBg px-3 py-2 text-sm text-white focus:border-adminAccent focus:outline-none"
                />
                <input
                  required
                  type="url"
                  placeholder="https://..."
                  value={s.link}
                  onChange={(e) => updateSource(i, "link", e.target.value)}
                  className="w-full rounded-md border border-adminBorder bg-adminBg px-3 py-2 text-sm text-white focus:border-adminAccent focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveSource(i, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  className="rounded border border-adminBorder px-2 py-1 text-xs text-white/60 transition-colors hover:border-adminAccent hover:text-adminAccent-soft disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveSource(i, 1)}
                  disabled={i === form.externalSources.length - 1}
                  aria-label="Move down"
                  className="rounded border border-adminBorder px-2 py-1 text-xs text-white/60 transition-colors hover:border-adminAccent hover:text-adminAccent-soft disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeSource(i)}
                  aria-label="Remove source"
                  className="rounded border border-adminBorder px-2 py-1 text-xs text-red-400/80 transition-colors hover:border-red-400 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button type="submit" disabled={saving} className="rounded-lg bg-gradient-to-r from-adminAccent to-adminAccent-violet px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
        {saving ? "Saving..." : book ? "Save Changes" : "Create Book"}
      </button>
    </form>
  );
}
