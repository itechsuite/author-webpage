"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ContactThread } from "@/types/contact";

export default function ContactThreadChat({ thread }: { thread: ContactThread }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    setSending(true);
    setError(null);

    const res = await fetch(`/api/admin/contact/${thread._id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });

    setSending(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to send reply");
      return;
    }

    setBody("");
    router.refresh();
  }

  async function toggleStatus() {
    await fetch(`/api/admin/contact/${thread._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: thread.status === "open" ? "closed" : "open" }),
    });
    router.refresh();
  }

  return (
    <div className="flex h-[calc(100vh-160px)] flex-col rounded-2xl border border-adminBorder bg-adminSurface">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-adminBorder p-4">
        <div>
          <p className="font-semibold text-white">{thread.name}</p>
          <p className="text-xs text-white/40">{thread.email}</p>
          {thread.subject && <p className="mt-0.5 text-xs text-white/50">{thread.subject}</p>}
        </div>
        <button
          onClick={toggleStatus}
          className="rounded-full border border-adminBorder px-3 py-1 text-xs text-white/60 hover:border-adminAccent hover:text-adminAccent-soft"
        >
          Mark as {thread.status === "open" ? "Closed" : "Open"}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {thread.messages.map((m, i) => {
          const isAdmin = m.from === "admin";
          return (
            <div key={i} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                  isAdmin
                    ? "bg-gradient-to-r from-adminAccent to-adminAccent-violet text-white"
                    : "bg-white/5 text-white/90"
                }`}
              >
                <p className="whitespace-pre-line">{m.body}</p>
                <p
                  className={`mt-1.5 text-[10px] ${
                    isAdmin ? "text-white/70" : "text-white/40"
                  }`}
                >
                  {isAdmin ? "You" : thread.name} ·{" "}
                  {new Date(m.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply box */}
      <form onSubmit={handleReply} className="border-t border-adminBorder p-4">
        <div className="flex items-end gap-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a reply — this will be emailed directly to the customer..."
            rows={3}
            className="flex-1 resize-none rounded-lg border border-adminBorder bg-adminBg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-adminAccent focus:outline-none"
          />
          <button
            type="submit"
            disabled={sending || !body.trim()}
            className="rounded-lg bg-gradient-to-r from-adminAccent to-adminAccent-violet px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </form>
    </div>
  );
}
