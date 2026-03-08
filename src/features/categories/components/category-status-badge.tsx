import { cn } from "@/src/lib/utils";

type CategoryStatusBadgeProps = {
  isActive: boolean;
};

export function CategoryStatusBadge({ isActive }: CategoryStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        isActive
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-slate-100 text-slate-600 ring-slate-200",
      )}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
