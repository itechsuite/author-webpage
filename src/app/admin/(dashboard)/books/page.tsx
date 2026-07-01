import Link from "next/link";
import Image from "next/image";
import { listBooks } from "@/lib/models/Book";
import DeleteBookButton from "@/components/admin/DeleteBookButton";

export default async function AdminBooksPage() {
  const books = await listBooks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Books</h1>
        <Link href="/admin/books/new" className="btn-accent">
          + Add New Book
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-900 text-cream-50/50">
            <tr>
              <th className="p-4">Cover</th>
              <th className="p-4">Title</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id} className="border-t border-white/10">
                <td className="p-4">
                  <div className="relative h-16 w-11 overflow-hidden rounded bg-ink-800">
                    {book.coverImageUrl && (
                      <Image src={book.coverImageUrl} alt={book.title} fill className="object-cover" />
                    )}
                  </div>
                </td>
                <td className="p-4 font-medium">{book.title}</td>
                <td className="p-4">
                  {book.currency} {book.price.toFixed(2)}
                </td>
                <td className="p-4">
                  <span
                    className={
                      book.published
                        ? "rounded bg-accent/20 px-2 py-1 text-xs font-semibold text-accent"
                        : "rounded bg-white/10 px-2 py-1 text-xs font-semibold text-cream-50/60"
                    }
                  >
                    {book.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <Link href={`/admin/books/${book._id}`} className="text-accent hover:underline">
                      Edit
                    </Link>
                    <DeleteBookButton id={book._id!} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
