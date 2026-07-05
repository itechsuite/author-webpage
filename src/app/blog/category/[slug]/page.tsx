import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeading from "@/components/PageHeading";
import BlogGrid from "@/components/BlogGrid";
import BlogPagination from "@/components/BlogPagination";
import { listPosts } from "@/lib/models/Post";
import { getCategoryBySlug } from "@/lib/models/Category";

export const revalidate = 60;

const PAGE_SIZE = 9;

export default async function BlogCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const { posts, total } = await listPosts({
    publishedOnly: true,
    category: slug,
    page,
    limit: PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <Navbar />
      <main>
        <PageHeading title={category.name} intro={category.description} />
        <BlogGrid posts={posts} />
        <BlogPagination basePath={`/blog/category/${slug}`} page={page} totalPages={totalPages} />
      </main>
      <Footer />
    </>
  );
}
