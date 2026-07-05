import Link from "next/link";
import Image from "next/image";
import { listPosts } from "@/lib/models/Post";
import { listCategories } from "@/lib/models/Category";
import DeletePostButton from "@/components/admin/DeletePostButton";
import BlogFilters from "@/components/admin/BlogFilters";

const STATUS_STYLES: Record<string, string> = {
  published: "bg-accent/20 text-accent",
  scheduled: "bg-yellow-500/20 text-yellow-400",
  draft: "bg-white/10 text-cream-50/60",
};

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string }>;
}) {
  const { status, category } = await searchParams;
  const [{ posts }, categories] = await Promise.all([
    listPosts({
      status: status as "draft" | "scheduled" | "published" | undefined,
      category,
      limit: 100,
    }),
    listCategories(),
  ]);

  const categoryNameBySlug = new Map(categories.map((c) => [c.slug, c.name]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog</h1>
        <div className="flex gap-3">
          <Link href="/admin/blog/categories" className="btn-outline">
            Manage Categories
          </Link>
          <Link href="/admin/blog/new" className="btn-accent">
            + New Post
          </Link>
        </div>
      </div>

      <BlogFilters categories={categories} />

      <div className="overflow-hidden rounded-lg border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-900 text-cream-50/50">
            <tr>
              <th className="p-4">Cover</th>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id} className="border-t border-white/10">
                <td className="p-4">
                  <div className="relative h-16 w-24 overflow-hidden rounded bg-ink-800">
                    {post.coverImageUrl && (
                      <Image
                        src={post.coverImageUrl}
                        alt={post.coverImageAlt || post.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className="p-4 font-medium">
                  {post.title}
                  {post.featured && (
                    <span className="ml-2 rounded bg-pink/20 px-2 py-0.5 text-xs font-semibold text-pink">
                      Featured
                    </span>
                  )}
                </td>
                <td className="p-4 text-cream-50/70">
                  {post.category ? categoryNameBySlug.get(post.category) || post.category : "—"}
                </td>
                <td className="p-4">
                  <span
                    className={`rounded px-2 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[post.status]}`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="p-4 text-cream-50/50">
                  {post.status === "scheduled" && post.scheduledAt
                    ? `Scheduled ${new Date(post.scheduledAt).toLocaleDateString()}`
                    : post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : "—"}
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <Link href={`/admin/blog/${post._id}`} className="text-accent hover:underline">
                      Edit
                    </Link>
                    <DeletePostButton id={post._id!} />
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-cream-50/40">
                  No posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
