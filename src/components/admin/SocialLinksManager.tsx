"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SocialLink, SocialPlatform } from "@/types/socialLink";

const PLATFORMS: SocialPlatform[] = [
  "instagram",
  "youtube",
  "twitter",
  "facebook",
  "tiktok",
  "pinterest",
  "linkedin",
  "other",
];

export default function SocialLinksManager({ links }: { links: SocialLink[] }) {
  const router = useRouter();
  const [platform, setPlatform] = useState<SocialPlatform>("instagram");
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/social-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, label: label || undefined, url, order: links.length }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(typeof data.error === "string" ? data.error : "Could not add link");
      return;
    }

    setLabel("");
    setUrl("");
    router.refresh();
  }

  async function handleRemove(id: string) {
    await fetch(`/api/social-links/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= links.length) return;

    const a = links[index];
    const b = links[target];
    await Promise.all([
      fetch(`/api/social-links/${a._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: b.order }),
      }),
      fetch(`/api/social-links/${b._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: a.order }),
      }),
    ]);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <label className="font-adminSans text-xs text-white/50">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
            className="rounded-lg border border-adminBorder bg-adminBg px-3 py-2 font-adminSans text-sm capitalize text-white focus:border-adminAccent focus:outline-none"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        {platform === "other" && (
          <div className="space-y-1.5">
            <label className="font-adminSans text-xs text-white/50">Label</label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Threads"
              className="w-40 rounded-lg border border-adminBorder bg-adminBg px-3 py-2 font-adminSans text-sm text-white focus:border-adminAccent focus:outline-none"
            />
          </div>
        )}
        <div className="space-y-1.5">
          <label className="font-adminSans text-xs text-white/50">URL</label>
          <input
            required
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-64 rounded-lg border border-adminBorder bg-adminBg px-3 py-2 font-adminSans text-sm text-white focus:border-adminAccent focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-gradient-to-r from-adminAccent to-adminAccent-violet px-5 py-2 font-adminSans text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Adding..." : "Add Link"}
        </button>
        {error && <p className="w-full font-adminSans text-xs text-red-400">{error}</p>}
      </form>

      <div className="space-y-2">
        {links.length === 0 && (
          <p className="font-adminSans text-sm italic text-white/40">No social links yet.</p>
        )}
        {links.map((link, i) => (
          <div
            key={link._id}
            className="flex items-center justify-between rounded-lg border border-adminBorder bg-adminBg px-4 py-3"
          >
            <div>
              <p className="font-adminSans text-sm font-medium capitalize text-white">
                {link.platform === "other" ? link.label || "Other" : link.platform}
              </p>
              <p className="font-adminSans text-xs text-white/50">{link.url}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleMove(i, -1)}
                disabled={i === 0}
                className="rounded border border-adminBorder px-2 py-1 text-xs text-white/60 hover:border-adminAccent hover:text-adminAccent-soft disabled:opacity-30"
              >
                ↑
              </button>
              <button
                onClick={() => handleMove(i, 1)}
                disabled={i === links.length - 1}
                className="rounded border border-adminBorder px-2 py-1 text-xs text-white/60 hover:border-adminAccent hover:text-adminAccent-soft disabled:opacity-30"
              >
                ↓
              </button>
              <button
                onClick={() => handleRemove(link._id!)}
                className="rounded border border-adminBorder px-2 py-1 text-xs text-red-400/80 hover:border-red-400 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
