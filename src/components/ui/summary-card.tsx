import { Card } from "@/src/components/ui/card";

type SummaryCardProps = {
  title: string;
  value: string;
  helperText: string;
};

export function SummaryCard({ title, value, helperText }: SummaryCardProps) {
  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{helperText}</p>
    </Card>
  );
}
