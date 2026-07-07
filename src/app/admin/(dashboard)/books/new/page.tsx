import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import BookForm from "@/components/admin/BookForm";

export default async function NewBookPage() {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageBooks")) {
    return <p className="text-white/60">You're not authorized to view this page.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Add New Book</h1>
      <BookForm />
    </div>
  );
}
