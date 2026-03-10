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
            <th className="px-4 py-3">Venta #</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Moneda</th>
            <th className="px-4 py-3">Ingresos</th>
            <th className="px-4 py-3">Costo</th>
            <th className="px-4 py-3">Ganancia</th>
            <th className="px-4 py-3">Margen</th>
            <th className="px-4 py-3">Completada</th>
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
