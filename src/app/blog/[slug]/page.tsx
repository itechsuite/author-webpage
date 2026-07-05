import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPostBySlug, listPosts } from "@/lib/models/Post";
import { getCategoryBySlug } from "@/lib/models/Category";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug, { publishedOnly: true });
  if (!post) return {};

  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.excerpt;
  const image = post.seo?.ogImageUrl || post.coverImageUrl;

  return {
    title: `${title} — ${process.env.NEXT_PUBLIC_SITE_NAME || "Author"}`,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug, { publishedOnly: true });

  if (!post) notFound();

  const [category, related] = await Promise.all([
    post.category ? getCategoryBySlug(post.category) : null,
    listPosts({ publishedOnly: true, category: post.category, limit: 3 }),
  ]);
  const relatedPosts = related.posts.filter((p) => p._id !== post._id).slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        <article className="section max-w-3xl !pb-16">
          <div className="mb-8 flex items-center gap-3 font-serif text-sm uppercase tracking-wide text-noir-muted">
            {category && (
              <Link href={`/blog/category/${category.slug}`} className="text-accent hover:underline">
                {category.name}
              </Link>
            )}
            {post.publishedAt && (
              <span>
                {new Date(post.publishedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            <span>· {post.readingTimeMinutes} min read</span>
          </div>

          <h1 className="text-4xl uppercase leading-tight tracking-[0.04em] text-noir md:text-6xl">
            {post.title}
          </h1>

          <p className="mt-6 font-serif text-xl italic leading-relaxed text-noir-muted">
            {post.excerpt}
          </p>

          <div className="mt-8 flex items-center gap-3 border-y border-linen-200 py-4 font-serif text-sm text-noir/80">
            {post.authorAvatarUrl && (
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-linen-100">
                <Image src={post.authorAvatarUrl} alt={post.authorName} fill className="object-cover" />
              </div>
            )}
            <span>By {post.authorName}</span>
          </div>

          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden bg-linen-100">
            <Image
              src={post.coverImageUrl}
              alt={post.coverImageAlt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div
            className="prose-content mt-10"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {post.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-linen-200 pt-8">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${encodeURIComponent(tag)}`}
                  className="border border-linen-200 px-3 py-1 font-serif text-xs uppercase tracking-wide text-noir-muted transition-colors hover:border-accent hover:text-accent"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </article>

        {relatedPosts.length > 0 && (
          <section className="section !pt-0">
            <h2 className="text-gradient mb-10 text-3xl uppercase tracking-[0.12em] md:text-4xl">
              More Like This
            </h2>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
              {relatedPosts.map((p) => (
                <Link key={p._id} href={`/blog/${p.slug}`} className="group">
                  <div className="relative aspect-[3/2] w-full overflow-hidden bg-linen-100">
                    <Image
                      src={p.coverImageUrl}
                      alt={p.coverImageAlt || p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="mt-4 font-display text-xl text-noir group-hover:text-accent">
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
