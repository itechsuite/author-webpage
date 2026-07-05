import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { getPostById } from "@/lib/models/Post";
import { listCategories } from "@/lib/models/Category";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([getPostById(id), listCategories()]);

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Post</h1>
      <PostForm post={post} categories={categories} />
    </div>
  );
}
