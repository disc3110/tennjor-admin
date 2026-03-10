"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RotateCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { PageHeader } from "@/src/components/ui/page-header";
import { QuotesEmptyState } from "@/src/features/quotes/components/quotes-empty-state";
import { QuotesLoadingState } from "@/src/features/quotes/components/quotes-loading-state";
import { QuotesStatusFilters } from "@/src/features/quotes/components/quotes-status-filters";
import { QuotesTable } from "@/src/features/quotes/components/quotes-table";
import { useQuotes } from "@/src/features/quotes/hooks/use-quotes";
import type { QuoteRequestStatus, QuoteStatusFilter } from "@/src/features/quotes/types/quote";

function mapFilterToBackendStatus(filter: QuoteStatusFilter): QuoteRequestStatus | undefined {
  switch (filter) {
    case "new":
      return "NEW";
    case "reviewed":
      // TODO: Confirm if "reviewed" should remain mapped to CONTACTED.
      return "CONTACTED";
    case "quoted":
      return "QUOTED";
    case "closed":
      return "CLOSED";
    default:
      return undefined;
  }
}

function parseFilter(value: string | null): QuoteStatusFilter {
  if (value === "new" || value === "reviewed" || value === "quoted" || value === "closed") {
    return value;
  }
  return "all";
}

export function QuotesView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedFilter = parseFilter(searchParams.get("status"));

  const backendStatus = useMemo(
    () => mapFilterToBackendStatus(selectedFilter),
    [selectedFilter],
  );

  const { quotes, meta, isLoading, error, refetch } = useQuotes({
    page: 1,
    limit: 20,
    status: backendStatus,
  });

  const handleFilterChange = (filter: QuoteStatusFilter) => {
    const params = new URLSearchParams(searchParams.toString());

    if (filter === "all") {
      params.delete("status");
    } else {
      params.set("status", filter);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title="Cotizaciones"
        subtitle="Solicitudes de cotización de clientes desde la tienda."
        action={
          <Button
            variant="secondary"
            iconLeft={<RotateCw className="size-4" />}
            onClick={() => {
              refetch().catch(() => {
                // Refetch errors are captured in hook state.
              });
            }}
            className="w-full md:w-auto"
          >
            Actualizar
          </Button>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500">Filtrar por estado actual de cotización</p>
          <QuotesStatusFilters value={selectedFilter} onChange={handleFilterChange} />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total de cotizaciones</p>
          <p className="text-3xl font-semibold text-slate-900">{meta?.total ?? "--"}</p>
        </Card>
        <Card className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Página</p>
          <p className="text-3xl font-semibold text-slate-900">{meta?.page ?? "--"}</p>
        </Card>
        <Card className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Total de páginas
          </p>
          <p className="text-3xl font-semibold text-slate-900">{meta?.totalPages ?? "--"}</p>
        </Card>
      </div>

      {isLoading ? <QuotesLoadingState /> : null}

      {!isLoading && error ? (
        <Card className="py-14 text-center">
          <h2 className="text-lg font-semibold text-slate-900">No se pudieron cargar las cotizaciones</h2>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
        </Card>
      ) : null}

      {!isLoading && !error && quotes.length === 0 ? <QuotesEmptyState /> : null}

      {!isLoading && !error && quotes.length > 0 ? (
        <Card className="p-0">
          <QuotesTable quotes={quotes} />
        </Card>
      ) : null}
    </section>
  );
}
