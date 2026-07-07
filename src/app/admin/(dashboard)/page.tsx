import Link from "next/link";
import { listBooks } from "@/lib/models/Book";
import { listOrders } from "@/lib/models/Order";
import { formatPrice } from "@/lib/format";

export default async function AdminDashboardPage() {
  const [books, orders] = await Promise.all([listBooks(), listOrders()]);
  const published = books.filter((b) => b.published).length;
  const paidOrders = orders.filter((o) => o.status === "paid");
  // Revenue grouped by currency since orders can span multiple currencies.
  const revenueByCurrency = paidOrders.reduce<Record<string, number>>((acc, o) => {
    acc[o.currency] = (acc[o.currency] || 0) + o.amountTotal;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
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
        <div className="rounded-lg border border-white/10 bg-ink-900 p-6">
          <p className="text-sm text-cream-50/50">Orders</p>
          <p className="mt-2 text-3xl font-bold text-accent">{paidOrders.length}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-ink-900 p-6">
          <p className="text-sm text-cream-50/50">Revenue</p>
          <p className="mt-2 text-3xl font-bold">
            {Object.keys(revenueByCurrency).length === 0
              ? formatPrice(0, "NGN")
              : Object.entries(revenueByCurrency)
                  .map(([currency, total]) => formatPrice(total / 100, currency))
                  .join(" + ")}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/admin/books/new" className="btn-accent inline-block">
          + Add New Book
        </Link>
        <Link href="/admin/orders" className="btn-outline inline-block">
          View Orders
        </Link>
      </div>
    </div>
  );
}
