import type { Post } from "@/types/post";
import BlogCard from "./BlogCard";

export default function BlogGrid({ posts, title }: { posts: Post[]; title?: string }) {
  if (posts.length === 0) {
    return (
      <div className="section text-center font-serif text-lg italic text-noir-muted">
        No posts published yet. Check back soon.
      </div>
    );
  }

  return (
    <section className="section">
      {title && (
        <h2 className="text-gradient mb-14 text-center text-4xl uppercase tracking-[0.15em] md:text-5xl">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}
