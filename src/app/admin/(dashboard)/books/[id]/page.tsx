import { notFound } from "next/navigation";
import BookForm from "@/components/admin/BookForm";
import { getBookById } from "@/lib/models/Book";

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Book</h1>
      <BookForm book={book} />
    </div>
  );
}
