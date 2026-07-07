import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import PostForm from "@/components/admin/PostForm";
import { getPostById } from "@/lib/models/Post";
import { listCategories } from "@/lib/models/Category";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageContent")) {
    return <p className="text-white/60">You're not authorized to view this page.</p>;
  }

  const { id } = await params;
  const [post, categories] = await Promise.all([getPostById(id), listCategories()]);

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Edit Post</h1>
      <PostForm post={post} categories={categories} />
    </div>
  );
}
