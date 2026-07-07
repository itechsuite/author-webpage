import Link from "next/link";
import { listOrders } from "@/lib/models/Order";
import { formatPrice } from "@/lib/format";
import RefundButton from "@/components/admin/RefundButton";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-accent/20 text-accent",
  failed: "bg-red-500/20 text-red-400",
  refunded: "bg-white/10 text-cream-50/60",
};

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-900 text-cream-50/50">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Book</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-cream-50/50">
                  No orders yet.
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order._id} className="border-t border-white/10 align-top">
                <td className="p-4 text-cream-50/70">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 font-medium">
                  <Link href={`/admin/books/${order.bookId}`} className="hover:text-accent">
                    {order.bookTitle}
                  </Link>
                </td>
                <td className="p-4 text-cream-50/70">
                  <p>{order.customerName || "—"}</p>
                  <p className="text-cream-50/50">{order.customerEmail}</p>
                </td>
                <td className="p-4">
                  {formatPrice(order.amountTotal / 100, order.currency)}
                </td>
                <td className="p-4">
                  <span
                    className={`rounded px-2 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  {order.status === "paid" && order.stripePaymentIntentId && (
                    <RefundButton orderId={order._id!} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
