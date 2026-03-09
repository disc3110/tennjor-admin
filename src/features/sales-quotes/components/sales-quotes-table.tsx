import Link from "next/link";
import type { InternalSaleQuoteSummary } from "@/src/features/sales-quotes/types/sales-quote";
import { SalesQuoteStatusBadge } from "@/src/features/sales-quotes/components/sales-quote-status-badge";
import { formatDateTime, formatMoney, formatPercent } from "@/src/features/sales/utils/format";

type SalesQuotesTableProps = {
  quotes: InternalSaleQuoteSummary[];
};

export function SalesQuotesTable({ quotes }: SalesQuotesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Code</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Currency</th>
            <th className="px-4 py-3">Revenue</th>
            <th className="px-4 py-3">Cost</th>
            <th className="px-4 py-3">Profit</th>
            <th className="px-4 py-3">Margin</th>
            <th className="px-4 py-3">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {quotes.map((quote) => (
            <tr key={quote.id} className="text-sm text-slate-700">
              <td className="px-4 py-3">
                <Link href={`/admin/sales-quotes/${quote.id}`} className="font-medium text-slate-900 hover:underline">
                  {quote.code}
                </Link>
              </td>
              <td className="px-4 py-3">
                <SalesQuoteStatusBadge status={quote.status} />
              </td>
              <td className="px-4 py-3">{quote.customerName}</td>
              <td className="px-4 py-3">{quote.currency}</td>
              <td className="px-4 py-3">{formatMoney(quote.totalRevenue, quote.currency)}</td>
              <td className="px-4 py-3">{formatMoney(quote.totalCost, quote.currency)}</td>
              <td className="px-4 py-3">{formatMoney(quote.totalProfit, quote.currency)}</td>
              <td className="px-4 py-3">{formatPercent(quote.marginPct)}</td>
              <td className="px-4 py-3">{formatDateTime(quote.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
