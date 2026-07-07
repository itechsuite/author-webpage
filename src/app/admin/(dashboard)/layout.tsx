import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ROLE_LABELS } from "@/types/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-adminBg font-adminSans text-white">
      <AdminSidebar email={session.email} roleLabel={ROLE_LABELS[session.role] || session.role} role={session.role} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
