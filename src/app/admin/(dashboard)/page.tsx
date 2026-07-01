import Link from "next/link";
import { listBooks } from "@/lib/models/Book";

export default async function AdminDashboardPage() {
  const books = await listBooks();
  const published = books.filter((b) => b.published).length;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-ink-900 p-6">
          <p className="text-sm text-cream-50/50">Total Books</p>
          <p className="mt-2 text-3xl font-bold">{books.length}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-ink-900 p-6">
          <p className="text-sm text-cream-50/50">Published</p>
          <p className="mt-2 text-3xl font-bold text-accent">{published}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-ink-900 p-6">
          <p className="text-sm text-cream-50/50">Drafts</p>
          <p className="mt-2 text-3xl font-bold">{books.length - published}</p>
        </div>
      </div>

      <Link href="/admin/books/new" className="btn-accent inline-block">
        + Add New Book
      </Link>
    </div>
  );
}
