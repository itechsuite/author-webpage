import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { getContactThreadById } from "@/lib/models/ContactThread";
import ContactThreadChat from "@/components/admin/ContactThreadChat";

export default async function AdminContactThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageContact")) {
    return <p className="text-white/60">You're not authorized to view this page.</p>;
  }

  const { id } = await params;
  const thread = await getContactThreadById(id);
  if (!thread) notFound();

  return <ContactThreadChat thread={thread} />;
}
