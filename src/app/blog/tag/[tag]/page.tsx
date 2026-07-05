import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeading from "@/components/PageHeading";
import BlogGrid from "@/components/BlogGrid";
import BlogPagination from "@/components/BlogPagination";
import { listPosts } from "@/lib/models/Post";

export const revalidate = 60;

const PAGE_SIZE = 9;

export default async function BlogTagPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { tag } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { posts, total } = await listPosts({
    publishedOnly: true,
    tag: decodeURIComponent(tag),
    page,
    limit: PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <Navbar />
      <main>
        <PageHeading title={`#${decodeURIComponent(tag)}`} />
        <BlogGrid posts={posts} />
        <BlogPagination basePath={`/blog/tag/${tag}`} page={page} totalPages={totalPages} />
      </main>
      <Footer />
    </>
  );
}
