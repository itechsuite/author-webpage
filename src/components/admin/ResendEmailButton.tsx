"use client";

import { useState } from "react";

export default function ResendEmailButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleResend() {
    setLoading(true);
    setStatus("idle");
    setError(null);

    const res = await fetch(`/api/admin/orders/${orderId}/resend-email`, { method: "POST" });
    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setStatus("error");
      setError(data.error || "Failed to resend");
      return;
    }

    setStatus("sent");
  }

  return (
    <div>
      <button
        onClick={handleResend}
        disabled={loading}
        className="rounded border border-adminAccent/40 px-2 py-1 text-xs text-adminAccent-soft transition-colors hover:border-adminAccent hover:bg-adminAccent/10 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Resend Email"}
      </button>
      {status === "sent" && <p className="mt-1 text-xs text-emerald-400">Sent!</p>}
      {status === "error" && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
