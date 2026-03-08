import type { QuoteRequestStatus } from "@/src/features/quotes/types/quote";
import { cn } from "@/src/lib/utils";

type QuoteStatusBadgeProps = {
  status: QuoteRequestStatus;
};

const statusStyles: Record<QuoteRequestStatus, string> = {
  NEW: "bg-blue-50 text-blue-700 ring-blue-200",
  CONTACTED: "bg-amber-50 text-amber-700 ring-amber-200",
  QUOTED: "bg-violet-50 text-violet-700 ring-violet-200",
  CLOSED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function QuoteStatusBadge({ status }: QuoteStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        statusStyles[status],
      )}
    >
      {status}
    </span>
  );
}
