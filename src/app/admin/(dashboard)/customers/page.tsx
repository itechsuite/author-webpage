import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { listCustomers } from "@/lib/models/Customer";
import { formatPrice } from "@/lib/format";
import AdminCard from "@/components/admin/AdminCard";

function totalSpent(purchases: { amountTotal: number; currency: string }[]) {
  const byCurrency = purchases.reduce<Record<string, number>>((acc, p) => {
    acc[p.currency] = (acc[p.currency] || 0) + p.amountTotal;
    return acc;
  }, {});
  return Object.entries(byCurrency)
    .map(([currency, total]) => formatPrice(total / 100, currency))
    .join(" + ");
}

export default async function AdminCustomersPage() {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageCustomers")) {
    return <p className="text-white/60">You're not authorized to view this page.</p>;
  }

  const customers = await listCustomers();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Customers</h1>

      <AdminCard className="!p-0 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-white/50">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Purchases</th>
              <th className="p-4">Lifetime Spend</th>
              <th className="p-4">Books Bought</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-white/50">
                  No customers yet.
                </td>
              </tr>
            )}
            {customers.map((customer) => (
              <tr key={customer._id} className="border-t border-adminBorder align-top">
                <td className="p-4">
                  <p className="font-medium text-white">{customer.name || "—"}</p>
                  <p className="text-white/40">{customer.email}</p>
                </td>
                <td className="p-4 text-white/70">{customer.purchases.length}</td>
                <td className="p-4 text-white/70">{totalSpent(customer.purchases)}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {customer.purchases.map((p, i) => (
                      <span
                        key={`${p.orderId}-${i}`}
                        className="rounded bg-white/5 px-2 py-1 text-xs text-white/60"
                      >
                        {p.bookTitle}
                      </span>
                    ))}
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
