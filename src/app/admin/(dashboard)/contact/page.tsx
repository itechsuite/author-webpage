import Link from "next/link";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { listContactThreads } from "@/lib/models/ContactThread";
import AdminCard from "@/components/admin/AdminCard";
import Badge from "@/components/admin/Badge";

export default async function AdminContactPage() {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageContact")) {
    return <p className="text-white/60">You're not authorized to view this page.</p>;
  }

  const threads = await listContactThreads();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Contact</h1>
        <p className="mt-1 text-sm text-white/50">
          Messages submitted through the site's contact form.
        </p>
      </div>

      <AdminCard className="!p-0 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-white/50">
            <tr>
              <th className="p-4">From</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Last message</th>
              <th className="p-4">Status</th>
              <th className="p-4">Updated</th>
            </tr>
          </thead>
          <tbody>
            {threads.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-white/50">
                  No messages yet.
                </td>
              </tr>
            )}
            {threads.map((thread) => {
              const last = thread.messages[thread.messages.length - 1];
              return (
                <tr key={thread._id} className="border-t border-adminBorder align-top">
                  <td className="p-4">
                    <Link
                      href={`/admin/contact/${thread._id}`}
                      className="font-medium text-white hover:text-adminAccent-soft"
                    >
                      {thread.name}
                    </Link>
                    <p className="text-white/40">{thread.email}</p>
                  </td>
                  <td className="p-4 text-white/70">{thread.subject || "—"}</td>
                  <td className="p-4 max-w-xs truncate text-white/60">
                    {last?.from === "admin" ? "You: " : ""}
                    {last?.body}
                  </td>
                  <td className="p-4">
                    <Badge tone={thread.status === "open" ? "accent" : "neutral"}>
                      {thread.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-white/40">
                    {new Date(thread.updatedAt).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </AdminCard>
    </div>
  );
}
