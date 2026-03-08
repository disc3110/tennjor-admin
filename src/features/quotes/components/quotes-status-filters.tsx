"use client";

import { cn } from "@/src/lib/utils";
import type { QuoteStatusFilter } from "@/src/features/quotes/types/quote";

type QuotesStatusFiltersProps = {
  value: QuoteStatusFilter;
  onChange: (value: QuoteStatusFilter) => void;
};

const filters: { value: QuoteStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "quoted", label: "Quoted" },
  { value: "closed", label: "Closed" },
];

export function QuotesStatusFilters({ value, onChange }: QuotesStatusFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onChange(filter.value)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
            value === filter.value
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400",
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
