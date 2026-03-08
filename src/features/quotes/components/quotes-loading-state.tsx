import { Card } from "@/src/components/ui/card";

export function QuotesLoadingState() {
  return (
    <Card className="space-y-4">
      <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-11 animate-pulse rounded bg-slate-100" />
        ))}
      </div>
    </Card>
  );
}
