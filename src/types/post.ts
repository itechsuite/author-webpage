export interface PostSeo {
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
}

export interface Post {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any; // Tiptap JSON document
  contentHtml: string; // rendered cache, generated server-side on save
  coverImageUrl: string;
  coverImageAlt?: string;
  category?: string; // Category slug
  tags: string[];
  status: "draft" | "scheduled" | "published";
  publishedAt?: string;
  scheduledAt?: string;
  authorName: string;
  authorAvatarUrl?: string;
  seo: PostSeo;
  readingTimeMinutes: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PostInput = Omit<
  Post,
  "_id" | "createdAt" | "updatedAt" | "slug" | "contentHtml" | "readingTimeMinutes"
> & {
  slug?: string;
};
