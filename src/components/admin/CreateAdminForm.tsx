"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROLE_LABELS, type Role } from "@/types/admin";

const ROLES: Role[] = ["super_admin", "store_manager", "content_editor", "support"];

export default function CreateAdminForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("support");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(typeof data.error === "string" ? data.error : "Could not create account");
      return;
    }

    setEmail("");
    setPassword("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div className="space-y-1.5">
        <label className="font-adminSans text-xs text-white/50">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-56 rounded-lg border border-adminBorder bg-adminBg px-3 py-2 font-adminSans text-sm text-white focus:border-adminAccent focus:outline-none"
        />
      </div>
      <div className="space-y-1.5">
        <label className="font-adminSans text-xs text-white/50">Password</label>
        <input
          required
          type="password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-48 rounded-lg border border-adminBorder bg-adminBg px-3 py-2 font-adminSans text-sm text-white focus:border-adminAccent focus:outline-none"
        />
      </div>
      <div className="space-y-1.5">
        <label className="font-adminSans text-xs text-white/50">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="rounded-lg border border-adminBorder bg-adminBg px-3 py-2 font-adminSans text-sm text-white focus:border-adminAccent focus:outline-none"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-gradient-to-r from-adminAccent to-adminAccent-violet px-5 py-2 font-adminSans text-sm font-semibold text-white disabled:opacity-50"
      >
        {saving ? "Creating..." : "Create Account"}
      </button>
      {error && <p className="w-full font-adminSans text-xs text-red-400">{error}</p>}
    </form>
  );
}
