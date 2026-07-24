import type { MetadataRoute } from "next";
import { listBooks } from "@/lib/models/Book";
import { listPosts } from "@/lib/models/Post";
import { listCategories } from "@/lib/models/Category";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [books, { posts }, categories] = await Promise.all([
    listBooks({ publishedOnly: true }),
    listPosts({ publishedOnly: true, limit: 1000 }),
    listCategories(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/books`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/newsletter`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const bookPages: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${siteUrl}/books/${book.slug}`,
    lastModified: book.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteUrl}/blog/category/${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...staticPages, ...bookPages, ...postPages, ...categoryPages];
}
