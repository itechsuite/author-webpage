import Link from "next/link";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { listOrders } from "@/lib/models/Order";
import { formatPrice } from "@/lib/format";
import RefundButton from "@/components/admin/RefundButton";
import AdminCard from "@/components/admin/AdminCard";
import Badge from "@/components/admin/Badge";

const STATUS_TONE: Record<string, "accent" | "danger" | "neutral"> = {
  paid: "accent",
  failed: "danger",
  refunded: "neutral",
};

export default async function AdminOrdersPage() {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageOrders")) {
    return <p className="text-white/60">You're not authorized to view this page.</p>;
  }

  const orders = await listOrders();
  const canRefund = hasPermission(session?.role, "issueRefunds");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Orders</h1>

      <AdminCard className="!p-0 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-white/50">
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
                <td colSpan={6} className="p-6 text-center text-white/50">
                  No orders yet.
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order._id} className="border-t border-adminBorder align-top">
                <td className="p-4 text-white/70">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 font-medium">
                  <Link href={`/admin/books/${order.bookId}`} className="text-white hover:text-adminAccent-soft">
                    {order.bookTitle}
                  </Link>
                </td>
                <td className="p-4 text-white/70">
                  <p>{order.customerName || "—"}</p>
                  <p className="text-white/40">{order.customerEmail}</p>
                </td>
                <td className="p-4 text-white/70">
                  {formatPrice(order.amountTotal / 100, order.currency)}
                </td>
                <td className="p-4">
                  <Badge tone={STATUS_TONE[order.status] || "neutral"}>{order.status}</Badge>
                </td>
                <td className="p-4">
                  {canRefund && order.status === "paid" && order.stripePaymentIntentId && (
                    <RefundButton orderId={order._id!} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
    </div>
  );
}
