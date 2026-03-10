import { cn } from "@/src/lib/utils";
import type { CompletedSaleStatus } from "@/src/features/sales/types/sale";

type SaleStatusBadgeProps = {
  status: CompletedSaleStatus;
};

const styles: Record<CompletedSaleStatus, string> = {
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-rose-100 text-rose-700",
  REFUNDED: "bg-amber-100 text-amber-700",
};

export function SaleStatusBadge({ status }: SaleStatusBadgeProps) {
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
