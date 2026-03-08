import { QuoteStatusBadge } from "@/src/features/quotes/components/quote-status-badge";
import type { AdminQuoteRequest } from "@/src/features/quotes/types/quote";

type QuotesTableProps = {
  quotes: AdminQuoteRequest[];
};

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

function buildItemsSummary(quote: AdminQuoteRequest) {
  if (quote.items.length === 0) return "No items";

  const firstItem = quote.items[0];
  if (quote.items.length === 1) {
    return `${firstItem.productNameSnapshot} x${firstItem.quantity}`;
  }

  return `${firstItem.productNameSnapshot} +${quote.items.length - 1} more`;
}

export function QuotesTable({ quotes }: QuotesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Items</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Received</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {quotes.map((quote) => (
            <tr key={quote.id} className="align-top">
              <td className="px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">{quote.customerName}</p>
                <p className="text-xs text-slate-500">{quote.customerEmail}</p>
                <p className="text-xs text-slate-500">{quote.customerPhone}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-slate-700">{buildItemsSummary(quote)}</p>
                <p className="text-xs text-slate-500">{quote.items.length} line(s)</p>
              </td>
              <td className="px-4 py-4">
                <QuoteStatusBadge status={quote.status} />
              </td>
              <td className="px-4 py-4 text-sm text-slate-700">{quote.source}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{formatDate(quote.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
