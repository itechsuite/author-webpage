import Link from "next/link";
import { listBooks } from "@/lib/models/Book";
import { listOrders } from "@/lib/models/Order";
import { listCustomers } from "@/lib/models/Customer";
import { formatPrice } from "@/lib/format";
import StatCard from "@/components/admin/StatCard";
import AdminCard from "@/components/admin/AdminCard";
import TrendChart from "@/components/admin/TrendChart";

const TREND_DAYS = 30;

function buildTrend(orders: { createdAt: string; status: string }[]) {
  const days: { label: string; value: number }[] = [];
  const counts = new Map<string, number>();

  for (const order of orders) {
    if (order.status !== "paid") continue;
    const key = order.createdAt.slice(0, 10); // YYYY-MM-DD
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  for (let i = TREND_DAYS - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ label: key, value: counts.get(key) || 0 });
  }

  return days;
}

export default async function AdminDashboardPage() {
  const [books, orders, customers] = await Promise.all([
    listBooks(),
    listOrders(),
    listCustomers(),
  ]);
  const published = books.filter((b) => b.published).length;
  const paidOrders = orders.filter((o) => o.status === "paid");
  // Revenue grouped by currency since orders can span multiple currencies.
  const revenueByCurrency = paidOrders.reduce<Record<string, number>>((acc, o) => {
    acc[o.currency] = (acc[o.currency] || 0) + o.amountTotal;
    return acc;
  }, {});
  const revenueLabel =
    Object.keys(revenueByCurrency).length === 0
      ? formatPrice(0, "NGN")
      : Object.entries(revenueByCurrency)
          .map(([currency, total]) => formatPrice(total / 100, currency))
          .join(" + ");

  const trend = buildTrend(orders);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-white/50">An overview of your store, right now.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Books" value={books.length} />
        <StatCard label="Published" value={published} />
        <StatCard label="Orders" value={paidOrders.length} accent />
        <StatCard label="Customers" value={customers.length} />
        <StatCard label="Revenue" value={revenueLabel} accent />
      </div>

      <AdminCard>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Orders — last 30 days</p>
          <p className="text-xs text-white/40">{paidOrders.length} paid orders total</p>
        </div>
        <div className="h-40">
          <TrendChart data={trend} />
        </div>
      </AdminCard>

      <div className="flex gap-4">
        <Link
          href="/admin/books/new"
          className="rounded-lg bg-gradient-to-r from-adminAccent to-adminAccent-violet px-5 py-2.5 text-sm font-semibold text-white"
        >
          + Add New Book
        </Link>
        <Link
          href="/admin/orders"
          className="rounded-lg border border-adminBorder px-5 py-2.5 text-sm font-semibold text-white/80 hover:border-adminAccent hover:text-adminAccent-soft"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
}
