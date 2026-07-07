"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RefundButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRefund() {
    if (!confirm("Refund this order? This charges back the customer via Stripe.")) return;

    setLoading(true);
    setError(null);

    const res = await fetch(`/api/admin/orders/${orderId}/refund`, { method: "POST" });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Refund failed");
      return;
    }

    router.refresh();
  }

  return (
    <div>
      <button
        onClick={handleRefund}
        disabled={loading}
        className="rounded border border-red-400/40 px-2 py-1 text-xs text-red-400 transition-colors hover:border-red-400 hover:bg-red-400/10 disabled:opacity-50"
      >
        {loading ? "Refunding..." : "Refund"}
      </button>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
