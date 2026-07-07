import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import PostForm from "@/components/admin/PostForm";
import { listCategories } from "@/lib/models/Category";

export default async function NewPostPage() {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageContent")) {
    return <p className="text-white/60">You're not authorized to view this page.</p>;
  }

  const categories = await listCategories();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">New Post</h1>
      <PostForm categories={categories} />
    </div>
  );
}
