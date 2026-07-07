import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { listPosts } from "@/lib/models/Post";
import { listCategories } from "@/lib/models/Category";
import DeletePostButton from "@/components/admin/DeletePostButton";
import BlogFilters from "@/components/admin/BlogFilters";
import AdminCard from "@/components/admin/AdminCard";
import Badge from "@/components/admin/Badge";

const STATUS_TONE: Record<string, "accent" | "neutral"> = {
  published: "accent",
  scheduled: "neutral",
  draft: "neutral",
};

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string }>;
}) {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageContent")) {
    return <p className="text-white/60">You're not authorized to view this page.</p>;
  }

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
        <h1 className="text-2xl font-bold text-white">Blog</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/blog/categories"
            className="rounded-lg border border-adminBorder px-5 py-2.5 text-sm font-semibold text-white/80 hover:border-adminAccent hover:text-adminAccent-soft"
          >
            Manage Categories
          </Link>
          <Link
            href="/admin/blog/new"
            className="rounded-lg bg-gradient-to-r from-adminAccent to-adminAccent-violet px-5 py-2.5 text-sm font-semibold text-white"
          >
            + New Post
          </Link>
        </div>
      </div>

      <BlogFilters categories={categories} />

      <AdminCard className="!p-0 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-white/50">
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
              <tr key={post._id} className="border-t border-adminBorder">
                <td className="p-4">
                  <div className="relative h-16 w-24 overflow-hidden rounded bg-white/5">
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
                <td className="p-4 font-medium text-white">
                  {post.title}
                  {post.featured && (
                    <Badge tone="accent" className="ml-2">
                      Featured
                    </Badge>
                  )}
                </td>
                <td className="p-4 text-white/70">
                  {post.category ? categoryNameBySlug.get(post.category) || post.category : "—"}
                </td>
                <td className="p-4">
                  <Badge tone={STATUS_TONE[post.status] || "neutral"}>{post.status}</Badge>
                </td>
                <td className="p-4 text-white/50">
                  {post.status === "scheduled" && post.scheduledAt
                    ? `Scheduled ${new Date(post.scheduledAt).toLocaleDateString()}`
                    : post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : "—"}
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/blog/${post._id}`}
                      className="text-adminAccent-soft hover:underline"
                    >
                      Edit
                    </Link>
                    <DeletePostButton id={post._id!} />
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-white/40">
                  No posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </AdminCard>
    </div>
  );
}
