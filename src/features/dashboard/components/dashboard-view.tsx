import { Card } from "@/src/components/ui/card";
import { SummaryCard } from "@/src/components/ui/summary-card";

export function DashboardView() {
  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          High-level overview of the store administration area.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Products" value="--" helperText="Awaiting API integration" />
        <SummaryCard title="Active Categories" value="--" helperText="Awaiting API integration" />
        <SummaryCard title="Quote Requests" value="--" helperText="Awaiting API integration" />
        <SummaryCard title="Pending Review" value="--" helperText="Awaiting API integration" />
      </div>

      <Card className="min-h-44">
        <h2 className="text-lg font-semibold text-slate-900">Activity</h2>
        <p className="mt-2 text-sm text-slate-500">
          Recent admin activity and alerts will appear here once backend integration is enabled.
        </p>
      </Card>
    </section>
  );
}
