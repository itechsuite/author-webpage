import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { listAdmins } from "@/lib/models/Admin";
import { ROLE_LABELS } from "@/types/admin";
import AdminCard from "@/components/admin/AdminCard";
import Badge from "@/components/admin/Badge";
import CreateAdminForm from "@/components/admin/CreateAdminForm";
import AdminRowActions from "@/components/admin/AdminRowActions";

export default async function AdminTeamPage() {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageAdmins")) {
    return (
      <p className="font-adminSans text-white/60">
        You're not authorized to view this page.
      </p>
    );
  }

  const admins = await listAdmins();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-adminSans text-2xl font-bold text-white">Team</h1>
        <p className="mt-1 font-adminSans text-sm text-white/50">
          Manage who has access to the admin panel and what they can do.
        </p>
      </div>

      <AdminCard>
        <p className="mb-4 font-adminSans text-sm font-semibold text-white">Add a team member</p>
        <CreateAdminForm />
      </AdminCard>

      <AdminCard className="!p-0 overflow-hidden">
        <table className="w-full text-left font-adminSans text-sm">
          <thead className="bg-white/5 text-white/50">
            <tr>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Manage</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id} className="border-t border-adminBorder">
                <td className="p-4 text-white">{admin.email}</td>
                <td className="p-4 text-white/70">{ROLE_LABELS[admin.role] || admin.role}</td>
                <td className="p-4">
                  <Badge tone={admin.active ? "success" : "neutral"}>
                    {admin.active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="p-4 text-white/50">
                  {new Date(admin.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <AdminRowActions
                    id={admin._id!}
                    role={admin.role}
                    active={admin.active}
                    disabled={admin.email === session?.email}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
    </div>
  );
}
