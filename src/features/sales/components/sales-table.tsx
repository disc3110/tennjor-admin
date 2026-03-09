import Link from "next/link";
import type { CompletedSaleSummary } from "@/src/features/sales/types/sale";
import { SaleStatusBadge } from "@/src/features/sales/components/sale-status-badge";
import { formatDateTime, formatMoney, formatPercent } from "@/src/features/sales/utils/format";

type SalesTableProps = {
  sales: CompletedSaleSummary[];
};

export function SalesTable({ sales }: SalesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Sale #</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Currency</th>
            <th className="px-4 py-3">Revenue</th>
            <th className="px-4 py-3">Cost</th>
            <th className="px-4 py-3">Profit</th>
            <th className="px-4 py-3">Margin</th>
            <th className="px-4 py-3">Completed</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {sales.map((sale) => (
            <tr key={sale.id} className="text-sm text-slate-700">
              <td className="px-4 py-3">
                <Link href={`/admin/sales/${sale.id}`} className="font-medium text-slate-900 hover:underline">
                  {sale.saleNumber}
                </Link>
              </td>
              <td className="px-4 py-3">
                <SaleStatusBadge status={sale.status} />
              </td>
              <td className="px-4 py-3">{sale.customerName}</td>
              <td className="px-4 py-3">{sale.currency}</td>
              <td className="px-4 py-3">{formatMoney(sale.totalRevenue, sale.currency)}</td>
              <td className="px-4 py-3">{formatMoney(sale.totalCost, sale.currency)}</td>
              <td className="px-4 py-3">{formatMoney(sale.totalProfit, sale.currency)}</td>
              <td className="px-4 py-3">{formatPercent(sale.marginPct)}</td>
              <td className="px-4 py-3">{formatDateTime(sale.completedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
