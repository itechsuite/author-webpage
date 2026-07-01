import BookForm from "@/components/admin/BookForm";

export default function NewBookPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add New Book</h1>
      <BookForm />
    </div>
  );
}
