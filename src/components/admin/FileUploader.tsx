"use client";

import { useState } from "react";

interface Props {
  label: string;
  folder: "covers" | "previews" | "files" | "secure";
  accept?: string;
  value?: string;
  onUploaded: (value: string) => void;
}

export default function FileUploader({ label, folder, accept, value, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // 1. Ask our API for a presigned R2 upload URL.
      const presignRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type, folder }),
      });

      if (!presignRes.ok) throw new Error("Could not get upload URL");
      const { uploadUrl, publicUrl, key } = await presignRes.json();

      // 2. Upload the file directly to R2 — it never touches our server.
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Upload to storage failed");

      // "secure" files are deliverable assets — only the raw key is ever
      // stored/returned, never the public URL, so it can't leak anywhere.
      const value = folder === "secure" ? key : publicUrl;
      setPreview(value);
      onUploaded(value);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm text-cream-50/70">{label}</label>

      {preview && (folder === "covers" || folder === "previews") && (
        <div className="mb-2">
          {folder === "covers" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" className="h-32 w-auto rounded border border-white/10" />
          ) : (
            <video src={preview} controls className="h-32 w-auto rounded border border-white/10" />
          )}
        </div>
      )}
      {preview && (folder === "files" || folder === "secure") && (
        <p className="mb-2 truncate text-xs text-cream-50/50">
          {folder === "secure" ? `Stored (key hidden from public API): ${preview}` : preview}
        </p>
      )}

      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-cream-50/70 file:mr-4 file:rounded-md file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-950 hover:file:bg-accent-hover"
      />

      {uploading && <p className="text-xs text-cream-50/50">Uploading...</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
