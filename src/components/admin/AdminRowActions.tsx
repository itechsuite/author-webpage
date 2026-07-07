"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROLE_LABELS, type Role } from "@/types/admin";

const ROLES: Role[] = ["super_admin", "store_manager", "content_editor", "support"];

export default function AdminRowActions({
  id,
  role,
  active,
  disabled,
}: {
  id: string;
  role: Role;
  active: boolean;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function patch(body: object) {
    setLoading(true);
    await fetch(`/api/admin/team/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    router.refresh();
  }

  if (disabled) {
    return <span className="font-adminSans text-xs text-white/30">You</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={role}
        disabled={loading}
        onChange={(e) => patch({ role: e.target.value })}
        className="rounded-lg border border-adminBorder bg-adminBg px-2 py-1 font-adminSans text-xs text-white focus:border-adminAccent focus:outline-none"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>
      <button
        disabled={loading}
        onClick={() => patch({ active: !active })}
        className="rounded-lg border border-adminBorder px-2 py-1 font-adminSans text-xs text-white/70 transition-colors hover:border-adminAccent hover:text-adminAccent-soft"
      >
        {active ? "Deactivate" : "Activate"}
      </button>
    </div>
  );
}
