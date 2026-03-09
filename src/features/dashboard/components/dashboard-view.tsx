"use client";

import { Download } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { SummaryCard } from "@/src/components/ui/summary-card";
import { useDashboardExport } from "@/src/features/dashboard/hooks/use-dashboard-export";

export function DashboardView() {
  const { isExporting, exportError, exportCsv } = useDashboardExport();

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">
            High-level overview of the store administration area.
          </p>
        </div>
        <Button
          variant="secondary"
          disabled={isExporting}
          iconLeft={<Download className="size-4" />}
          onClick={() => {
            exportCsv().catch(() => {
              // Errors are handled in hook state.
            });
          }}
          className="w-full sm:w-auto"
        >
          {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
      </div>

      {exportError ? (
        <Card>
          <p className="text-sm font-medium text-red-600">{exportError}</p>
        </Card>
      ) : null}

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
