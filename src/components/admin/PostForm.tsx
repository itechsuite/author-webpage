"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import FileUploader from "./FileUploader";
import type { Post } from "@/types/post";
import type { Category } from "@/types/category";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[320px] items-center justify-center rounded-md border border-adminBorder bg-adminBg text-sm text-white/30">
      Loading editor…
    </div>
  ),
});

const inputClass =
  "w-full rounded-md border border-adminBorder bg-adminBg px-4 py-2 text-white focus:border-adminAccent focus:outline-none";

interface Props {
  post?: Post;
  categories: Category[];
}

const emptyDoc = { type: "doc", content: [{ type: "paragraph" }] };

export default function PostForm({ post, categories }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || emptyDoc,
    coverImageUrl: post?.coverImageUrl || "",
    coverImageAlt: post?.coverImageAlt || "",
    category: post?.category || "",
    tags: post?.tags || ([] as string[]),
    status: post?.status || "draft",
    scheduledAt: post?.scheduledAt ? post.scheduledAt.slice(0, 16) : "",
    authorName: post?.authorName || process.env.NEXT_PUBLIC_SITE_NAME || "",
    authorAvatarUrl: post?.authorAvatarUrl || "",
    featured: post?.featured ?? false,
    seo: {
      metaTitle: post?.seo?.metaTitle || "",
      metaDescription: post?.seo?.metaDescription || "",
      ogImageUrl: post?.seo?.ogImageUrl || "",
    },
  });
  const [tagInput, setTagInput] = useState("");
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [seoOpen, setSeoOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateSeo<K extends keyof typeof form.seo>(key: K, value: (typeof form.seo)[K]) {
    setForm((prev) => ({ ...prev, seo: { ...prev.seo, [key]: value } }));
  }

  function handleTitleChange(title: string) {
    update("title", title);
    if (!slugTouched) {
      update("slug", slugify(title, { lower: true, strict: true }));
    }
  }

  function addTag() {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      update("tags", [...form.tags, tag]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    update(
      "tags",
      form.tags.filter((t) => t !== tag)
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      authorAvatarUrl: form.authorAvatarUrl || undefined,
      scheduledAt: form.status === "scheduled" && form.scheduledAt
        ? new Date(form.scheduledAt).toISOString()
        : undefined,
    };

    const url = post ? `/api/posts/${post._id}` : "/api/posts";
    const method = post ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(JSON.stringify(data.error) || "Something went wrong");
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="space-y-2">
        <label className="text-sm text-white/60">Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/60">Slug</label>
        <input
          required
          value={form.slug}
          onChange={(e) => {
            setSlugTouched(true);
            update("slug", e.target.value);
          }}
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/60">Excerpt</label>
        <textarea
          required
          rows={3}
          value={form.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          className={inputClass}
          placeholder="Short summary shown on the blog index and used as a fallback meta description."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/60">Content</label>
        <RichTextEditor value={form.content} onChange={(json) => update("content", json)} />
      </div>

      <FileUploader
        label="Cover Image"
        folder="covers"
        accept="image/*"
        value={form.coverImageUrl}
        onUploaded={(url) => update("coverImageUrl", url)}
      />

      <div className="space-y-2">
        <label className="text-sm text-white/60">Cover Image Alt Text</label>
        <input
          value={form.coverImageAlt}
          onChange={(e) => update("coverImageAlt", e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-white/60">Category</label>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className={inputClass}
          >
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/60">Author Name</label>
          <input
            required
            value={form.authorName}
            onChange={(e) => update("authorName", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/60">Tags</label>
        <div className="flex flex-wrap gap-2">
          {form.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/80"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-white/30 hover:text-white"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag();
            }
          }}
          onBlur={addTag}
          placeholder="Type a tag and press Enter"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-white/60">Status</label>
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value as typeof form.status)}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>

        {form.status === "scheduled" && (
          <div className="space-y-2">
            <label className="text-sm text-white/60">Publish at</label>
            <input
              type="datetime-local"
              required
              value={form.scheduledAt}
              onChange={(e) => update("scheduledAt", e.target.value)}
              className={inputClass}
            />
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-white/60">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => update("featured", e.target.checked)}
        />
        Featured
      </label>

      <div className="rounded-md border border-adminBorder">
        <button
          type="button"
          onClick={() => setSeoOpen((o) => !o)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-white/80"
        >
          SEO &amp; Social Sharing
          <span className="text-white/30">{seoOpen ? "−" : "+"}</span>
        </button>
        {seoOpen && (
          <div className="space-y-4 border-t border-adminBorder p-4">
            <div className="space-y-2">
              <label className="text-sm text-white/60">Meta Title</label>
              <input
                value={form.seo.metaTitle}
                onChange={(e) => updateSeo("metaTitle", e.target.value)}
                className={inputClass}
                placeholder={form.title || "Falls back to the post title"}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/60">Meta Description</label>
              <textarea
                rows={2}
                value={form.seo.metaDescription}
                onChange={(e) => updateSeo("metaDescription", e.target.value)}
                className={inputClass}
                placeholder={form.excerpt || "Falls back to the excerpt"}
              />
            </div>
            <FileUploader
              label="Social Share Image (Open Graph)"
              folder="covers"
              accept="image/*"
              value={form.seo.ogImageUrl}
              onUploaded={(url) => updateSeo("ogImageUrl", url)}
            />
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button type="submit" disabled={saving} className="rounded-lg bg-gradient-to-r from-adminAccent to-adminAccent-violet px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
        {saving ? "Saving..." : post ? "Save Changes" : "Create Post"}
      </button>
    </form>
  );
}
