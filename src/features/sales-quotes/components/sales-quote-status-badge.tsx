import { cn } from "@/src/lib/utils";
import type { InternalSaleQuoteStatus } from "@/src/features/sales-quotes/types/sales-quote";

type SalesQuoteStatusBadgeProps = {
  status: InternalSaleQuoteStatus;
};

const styles: Record<InternalSaleQuoteStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SENT: "bg-blue-100 text-blue-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-700",
  EXPIRED: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-purple-100 text-purple-700",
};

export function SalesQuoteStatusBadge({ status }: SalesQuoteStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}
