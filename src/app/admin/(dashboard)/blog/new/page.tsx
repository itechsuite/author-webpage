import PostForm from "@/components/admin/PostForm";
import { listCategories } from "@/lib/models/Category";

export default async function NewPostPage() {
  const categories = await listCategories();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Post</h1>
      <PostForm categories={categories} />
    </div>
  );
}
