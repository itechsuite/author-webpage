import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { listSocialLinks } from "@/lib/models/SocialLink";
import AdminCard from "@/components/admin/AdminCard";
import SocialLinksManager from "@/components/admin/SocialLinksManager";

export default async function AdminSocialLinksPage() {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageSocialLinks")) {
    return (
      <p className="font-adminSans text-white/60">
        You're not authorized to view this page.
      </p>
    );
  }

  const links = await listSocialLinks();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-adminSans text-2xl font-bold text-white">Social Links</h1>
        <p className="mt-1 font-adminSans text-sm text-white/50">
          Shown in the site footer/nav — changes go live immediately, no deploy needed.
        </p>
      </div>

      <AdminCard>
        <SocialLinksManager links={links} />
      </AdminCard>
    </div>
  );
}
