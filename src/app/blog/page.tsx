import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeading from "@/components/PageHeading";
import BlogGrid from "@/components/BlogGrid";
import BlogPagination from "@/components/BlogPagination";
import { listPosts } from "@/lib/models/Post";
import { listCategories } from "@/lib/models/Category";
import Link from "next/link";

export const revalidate = 60;

const PAGE_SIZE = 9;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [{ posts, total }, categories] = await Promise.all([
    listPosts({ publishedOnly: true, page, limit: PAGE_SIZE }),
    listCategories(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <Navbar />
      <main>
        <PageHeading
          title="Blog"
          intro="Notes on writing, publishing, and the stories behind the stories."
        />

        {categories.length > 0 && (
          <div className="mx-auto flex max-w-content flex-wrap gap-3 px-6 pt-12">
            {categories.map((c) => (
              <Link
                key={c._id}
                href={`/blog/category/${c.slug}`}
                className="rounded-full border border-linen-200 px-4 py-1.5 font-serif text-sm text-noir/80 transition-colors hover:border-accent hover:text-accent"
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        <BlogGrid posts={posts} />
        <BlogPagination basePath="/blog" page={page} totalPages={totalPages} />
      </main>
      <Footer />
    </>
  );
}
