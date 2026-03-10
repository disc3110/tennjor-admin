import type { MonetaryValue } from "@/src/features/sales-quotes/types/sales-quote";

export function toNumber(value: MonetaryValue | null | undefined): number {
  if (value == null) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatMoney(value: MonetaryValue | null | undefined, currency = "MXN") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toNumber(value));
}

export function formatPercent(value: MonetaryValue | null | undefined) {
  return `${toNumber(value).toFixed(2)}%`;
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "--";
  return new Date(value).toLocaleString();
}
