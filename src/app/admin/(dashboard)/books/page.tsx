import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { listBooks } from "@/lib/models/Book";
import DeleteBookButton from "@/components/admin/DeleteBookButton";
import AdminCard from "@/components/admin/AdminCard";
import Badge from "@/components/admin/Badge";

export default async function AdminBooksPage() {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageBooks")) {
    return <p className="text-white/60">You're not authorized to view this page.</p>;
  }

  const books = await listBooks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Books</h1>
        <Link
          href="/admin/books/new"
          className="rounded-lg bg-gradient-to-r from-adminAccent to-adminAccent-violet px-5 py-2.5 text-sm font-semibold text-white"
        >
          + Add New Book
        </Link>
      </div>

      <AdminCard className="!p-0 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-white/50">
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
              <tr key={book._id} className="border-t border-adminBorder">
                <td className="p-4">
                  <div className="relative h-16 w-11 overflow-hidden rounded bg-white/5">
                    {book.coverImageUrl && (
                      <Image src={book.coverImageUrl} alt={book.title} fill className="object-cover" />
                    )}
                  </div>
                </td>
                <td className="p-4 font-medium text-white">{book.title}</td>
                <td className="p-4 text-white/70">
                  {book.currency} {book.price.toFixed(2)}
                </td>
                <td className="p-4">
                  <Badge tone={book.published ? "accent" : "neutral"}>
                    {book.published ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/books/${book._id}`}
                      className="text-adminAccent-soft hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteBookButton id={book._id!} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
    </div>
  );
}
