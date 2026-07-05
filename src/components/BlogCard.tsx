import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/post";

export default function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col">
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-linen-100">
        <Image
          src={post.coverImageUrl}
          alt={post.coverImageAlt || post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 pt-5">
        <div className="flex items-center gap-3 font-serif text-xs uppercase tracking-wide text-noir-muted">
          {post.category && <span className="text-accent">{post.category.replace(/-/g, " ")}</span>}
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

        <h3 className="font-display text-2xl leading-snug text-noir transition-colors group-hover:text-accent">
          {post.title}
        </h3>

        <p className="font-serif text-base leading-relaxed text-noir/75 line-clamp-3">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}
