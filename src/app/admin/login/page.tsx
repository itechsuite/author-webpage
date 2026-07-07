"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Login failed");
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-adminBg px-6 font-adminSans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-adminBorder bg-adminSurface p-8 shadow-[0_0_60px_-20px_rgba(76,125,255,0.35)]"
      >
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40">Admin Panel</p>
          <h1 className="mt-1 text-xl font-bold text-white">Sign in</h1>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/60">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-adminBorder bg-adminBg px-4 py-2.5 text-white focus:border-adminAccent focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/60">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-adminBorder bg-adminBg px-4 py-2.5 text-white focus:border-adminAccent focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-adminAccent to-adminAccent-violet px-4 py-2.5 font-semibold text-white shadow-[0_0_30px_-8px_rgba(76,125,255,0.7)] transition-opacity disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
