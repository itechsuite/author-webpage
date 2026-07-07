import { listCustomers } from "@/lib/models/Customer";
import { formatPrice } from "@/lib/format";

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
  const customers = await listCustomers();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customers</h1>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-900 text-cream-50/50">
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
                <td colSpan={4} className="p-6 text-center text-cream-50/50">
                  No customers yet.
                </td>
              </tr>
            )}
            {customers.map((customer) => (
              <tr key={customer._id} className="border-t border-white/10 align-top">
                <td className="p-4">
                  <p className="font-medium">{customer.name || "—"}</p>
                  <p className="text-cream-50/50">{customer.email}</p>
                </td>
                <td className="p-4 text-cream-50/70">{customer.purchases.length}</td>
                <td className="p-4">{totalSpent(customer.purchases)}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {customer.purchases.map((p, i) => (
                      <span
                        key={`${p.orderId}-${i}`}
                        className="rounded bg-white/5 px-2 py-1 text-xs text-cream-50/70"
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
      </div>
    </div>
  );
}
