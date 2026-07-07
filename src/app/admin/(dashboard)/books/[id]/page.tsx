import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import BookForm from "@/components/admin/BookForm";
import { getBookById } from "@/lib/models/Book";

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageBooks")) {
    return <p className="text-white/60">You're not authorized to view this page.</p>;
  }

  const { id } = await params;
  const book = await getBookById(id, { includeSecure: true });

  if (!book) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Edit Book</h1>
      <BookForm book={book} />
    </div>
  );
}
