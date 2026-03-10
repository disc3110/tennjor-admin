"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download, RotateCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { PageHeader } from "@/src/components/ui/page-header";
import { SalesStatsPanel } from "@/src/features/sales/components/sales-stats-panel";
import { SalesTable } from "@/src/features/sales/components/sales-table";
import { useSales } from "@/src/features/sales/hooks/use-sales";
import { useSalesExport } from "@/src/features/sales/hooks/use-sales-export";
import { useSalesStats } from "@/src/features/sales/hooks/use-sales-stats";
import type { CompletedSaleStatus, SalesStatsPeriod } from "@/src/features/sales/types/sale";

type SaleStatusFilter = "all" | CompletedSaleStatus;

type SortBy = "completedAt" | "createdAt" | "totalRevenue" | "totalProfit";

type SortOrder = "asc" | "desc";

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

function parseStatus(value: string | null): SaleStatusFilter {
  if (value === "COMPLETED" || value === "CANCELLED" || value === "REFUNDED") return value;
  return "all";
}

function parsePeriod(value: string | null): SalesStatsPeriod {
  if (value === "month" || value === "year" || value === "custom") return value;
  return "month";
}

function parseSortBy(value: string | null): SortBy {
  if (
    value === "completedAt" ||
    value === "createdAt" ||
    value === "totalRevenue" ||
    value === "totalProfit"
  ) {
    return value;
  }
  return "completedAt";
}

function parseSortOrder(value: string | null): SortOrder {
  if (value === "asc" || value === "desc") return value;
  return "desc";
}

export function SalesView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = parseStatus(searchParams.get("status"));
  const customerName = searchParams.get("customerName") ?? "";
  const saleNumber = searchParams.get("saleNumber") ?? "";
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";
  const page = parsePositiveInt(searchParams.get("page"), 1);
  const limit = parsePositiveInt(searchParams.get("limit"), 20);
  const sortBy = parseSortBy(searchParams.get("sortBy"));
  const sortOrder = parseSortOrder(searchParams.get("sortOrder"));

  const statsPeriod = parsePeriod(searchParams.get("statsPeriod"));
  const statsYear = parsePositiveInt(searchParams.get("statsYear"), new Date().getFullYear());
  const statsMonth = parsePositiveInt(searchParams.get("statsMonth"), new Date().getMonth() + 1);
  const statsDateFrom = searchParams.get("statsDateFrom") ?? "";
  const statsDateTo = searchParams.get("statsDateTo") ?? "";
  const statsStatus = parseStatus(searchParams.get("statsStatus"));

  const { sales, meta, isLoading, error, refetch } = useSales({
    page,
    limit,
    status: status === "all" ? undefined : status,
    customerName: customerName || undefined,
    saleNumber: saleNumber || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    sortBy,
    sortOrder,
  });

  const statsQuery = useMemo(
    () => ({
      period: statsPeriod,
      year: statsPeriod === "custom" ? undefined : statsYear,
      month: statsPeriod === "month" ? statsMonth : undefined,
      dateFrom: statsPeriod === "custom" ? statsDateFrom || undefined : undefined,
      dateTo: statsPeriod === "custom" ? statsDateTo || undefined : undefined,
      status: statsStatus === "all" ? undefined : statsStatus,
    }),
    [statsDateFrom, statsDateTo, statsMonth, statsPeriod, statsStatus, statsYear],
  );

  const { stats, isLoading: isStatsLoading, error: statsError } = useSalesStats(statsQuery);
  const { isExporting, exportError, exportCsv } = useSalesExport();

  const updateQuery = (next: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title="Ventas"
        subtitle="Ventas completadas, reportes y controles de exportación."
        action={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              variant="secondary"
              disabled={isExporting}
              iconLeft={<Download className="size-4" />}
              onClick={() => {
                exportCsv({
                  status: status === "all" ? undefined : status,
                  customerName: customerName || undefined,
                  saleNumber: saleNumber || undefined,
                  dateFrom: dateFrom || undefined,
                  dateTo: dateTo || undefined,
                  sortBy,
                  sortOrder,
                }).catch(() => {
                  // Errors are handled in hook state.
                });
              }}
            >
              {isExporting ? "Exportando..." : "Exportar CSV"}
            </Button>
            <Button
              variant="secondary"
              iconLeft={<RotateCw className="size-4" />}
              onClick={() => {
                refetch().catch(() => {
                  // Refetch errors are handled in hook state.
                });
              }}
            >
              Actualizar
            </Button>
          </div>
        }
      />

      {exportError ? (
        <Card>
          <p className="text-sm font-medium text-red-600">{exportError}</p>
        </Card>
      ) : null}

      <Card>
        <h2 className="text-sm font-semibold text-slate-800">Filtros de estadísticas de ventas</h2>
        <div className="mt-3 grid gap-3 lg:grid-cols-6">
          <select
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
            value={statsPeriod}
            onChange={(event) =>
              updateQuery({
                statsPeriod: event.target.value,
              })
            }
          >
            <option value="month">Mes</option>
            <option value="year">Año</option>
            <option value="custom">Personalizado</option>
          </select>
          <Input
            type="number"
            min={2000}
            max={3000}
            value={statsYear}
            onChange={(event) => updateQuery({ statsYear: parsePositiveInt(event.target.value, statsYear) })}
            disabled={statsPeriod === "custom"}
          />
          <Input
            type="number"
            min={1}
            max={12}
            value={statsMonth}
            onChange={(event) =>
              updateQuery({ statsMonth: parsePositiveInt(event.target.value, statsMonth) })
            }
            disabled={statsPeriod !== "month"}
          />
          <Input
            type="date"
            value={statsDateFrom}
            onChange={(event) => updateQuery({ statsDateFrom: event.target.value })}
            disabled={statsPeriod !== "custom"}
          />
          <Input
            type="date"
            value={statsDateTo}
            onChange={(event) => updateQuery({ statsDateTo: event.target.value })}
            disabled={statsPeriod !== "custom"}
          />
          <select
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
            value={statsStatus}
            onChange={(event) => updateQuery({ statsStatus: event.target.value })}
          >
            <option value="all">Todos los estados</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>
      </Card>

      <SalesStatsPanel stats={stats} isLoading={isStatsLoading} error={statsError} currency="MXN" />

      <Card>
        <div className="grid gap-3 lg:grid-cols-4 xl:grid-cols-8">
          <select
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
            value={status}
            onChange={(event) => updateQuery({ status: event.target.value, page: 1 })}
          >
            <option value="all">Todos los estados</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>

          <Input
            value={customerName}
            onChange={(event) => updateQuery({ customerName: event.target.value, page: 1 })}
            placeholder="Nombre del cliente"
          />

          <Input
            value={saleNumber}
            onChange={(event) => updateQuery({ saleNumber: event.target.value, page: 1 })}
            placeholder="Número de venta"
          />

          <Input
            type="date"
            value={dateFrom}
            onChange={(event) => updateQuery({ dateFrom: event.target.value, page: 1 })}
          />

          <Input
            type="date"
            value={dateTo}
            onChange={(event) => updateQuery({ dateTo: event.target.value, page: 1 })}
          />

          <select
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
            value={sortBy}
            onChange={(event) => updateQuery({ sortBy: event.target.value })}
          >
            <option value="completedAt">Ordenar por completedAt</option>
            <option value="createdAt">Ordenar por createdAt</option>
            <option value="totalRevenue">Ordenar por totalRevenue</option>
            <option value="totalProfit">Ordenar por totalProfit</option>
          </select>

          <select
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
            value={sortOrder}
            onChange={(event) => updateQuery({ sortOrder: event.target.value })}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>

          <div className="flex gap-2">
            <Input
              type="number"
              min={1}
              value={page}
              onChange={(event) => updateQuery({ page: parsePositiveInt(event.target.value, 1) })}
              placeholder="Página"
            />
            <Input
              type="number"
              min={1}
              value={limit}
              onChange={(event) => updateQuery({ limit: parsePositiveInt(event.target.value, 20), page: 1 })}
              placeholder="Límite"
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total</p>
          <p className="text-2xl font-semibold text-slate-900">{meta?.total ?? "--"}</p>
        </Card>
        <Card className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Página</p>
          <p className="text-2xl font-semibold text-slate-900">{meta?.page ?? "--"}</p>
        </Card>
        <Card className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Limit</p>
          <p className="text-2xl font-semibold text-slate-900">{meta?.limit ?? "--"}</p>
        </Card>
        <Card className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total de páginas</p>
          <p className="text-2xl font-semibold text-slate-900">{meta?.totalPages ?? "--"}</p>
        </Card>
      </div>

      {isLoading ? <Card className="h-56 animate-pulse bg-slate-100" /> : null}

      {!isLoading && error ? (
        <Card className="py-14 text-center">
          <h2 className="text-lg font-semibold text-slate-900">No se pudieron cargar las ventas</h2>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
        </Card>
      ) : null}

      {!isLoading && !error && sales.length === 0 ? (
        <Card className="py-14 text-center">
          <h2 className="text-lg font-semibold text-slate-900">No se encontraron ventas</h2>
          <p className="mt-2 text-sm text-slate-500">Ajusta los filtros e inténtalo de nuevo.</p>
        </Card>
      ) : null}

      {!isLoading && !error && sales.length > 0 ? (
        <Card className="p-0">
          <SalesTable sales={sales} />
        </Card>
      ) : null}
    </section>
  );
}
