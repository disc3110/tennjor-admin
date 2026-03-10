"use client";

import Link from "next/link";
import { Download, RotateCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { SummaryCard } from "@/src/components/ui/summary-card";
import { useDashboardData } from "@/src/features/dashboard/hooks/use-dashboard-data";
import { useDashboardExport } from "@/src/features/dashboard/hooks/use-dashboard-export";
import { formatDateTime, formatMoney, formatPercent } from "@/src/features/sales/utils/format";

export function DashboardView() {
  const { data, isLoading, error, refetch } = useDashboardData();
  const { isExporting, exportError, exportCsv } = useDashboardExport();

  const monthlyCurrency = data?.recentSales[0]?.currency ?? "MXN";

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Panel de control</h1>
          <p className="text-sm text-slate-500">
            Resumen en tiempo real de cotizaciones, catálogo y rendimiento de ventas.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
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
            {isExporting ? "Exportando..." : "Exportar CSV"}
          </Button>
        </div>
      </div>

      {exportError ? (
        <Card>
          <p className="text-sm font-medium text-red-600">{exportError}</p>
        </Card>
      ) : null}

      {error ? (
        <Card>
          <p className="text-sm font-medium text-red-600">{error}</p>
        </Card>
      ) : null}

      {isLoading || !data ? (
        <Card className="h-56 animate-pulse bg-slate-100" />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <SummaryCard
              title="Total de productos"
              value={String(data.totalProducts)}
              helperText="Del catálogo de productos admin"
            />
            <SummaryCard
              title="Categorías activas"
              value={String(data.activeCategories)}
              helperText="Grupos visibles en la tienda"
            />
            <SummaryCard
              title="Total de solicitudes"
              value={String(data.totalQuotes)}
              helperText="Todas las solicitudes registradas"
            />
            <SummaryCard
              title="Pendientes de revisión"
              value={String(data.newQuotes)}
              helperText="Solicitudes con estado NEW"
            />
            <SummaryCard
              title="Ventas este mes"
              value={String(data.monthlySalesStats.salesCount)}
              helperText="Ventas completadas del mes actual"
            />
            <SummaryCard
              title="Ganancia este mes"
              value={formatMoney(data.monthlySalesStats.totalProfit, monthlyCurrency)}
              helperText="Ganancia total del mes actual"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Ingresos del mes
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                {formatMoney(data.monthlySalesStats.totalRevenue, monthlyCurrency)}
              </p>
            </Card>
            <Card className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Costo del mes</p>
              <p className="text-2xl font-semibold text-slate-900">
                {formatMoney(data.monthlySalesStats.totalCost, monthlyCurrency)}
              </p>
            </Card>
            <Card className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Margen promedio</p>
              <p className="text-2xl font-semibold text-slate-900">
                {formatPercent(data.monthlySalesStats.averageMarginPct)}
              </p>
            </Card>
            <Card className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Ticket promedio</p>
              <p className="text-2xl font-semibold text-slate-900">
                {formatMoney(data.monthlySalesStats.averageTicket, monthlyCurrency)}
              </p>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <h2 className="text-lg font-semibold text-slate-900">Desglose por estado de cotización</h2>
              <div className="mt-4 space-y-2">
                {Object.entries(data.quoteStatusBreakdown).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                    <span className="font-medium text-slate-700">{status}</span>
                    <span className="font-semibold text-slate-900">{count}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-slate-900">Productos más solicitados</h2>
              <div className="mt-4 space-y-2">
                {data.topRequestedProducts.length === 0 ? (
                  <p className="text-sm text-slate-500">No hay datos de solicitudes.</p>
                ) : (
                  data.topRequestedProducts.map((item) => (
                    <div key={item.productId} className="rounded-lg bg-slate-50 px-3 py-2">
                      <p className="text-sm font-semibold text-slate-900">{item.productName}</p>
                      <p className="text-xs text-slate-500">/{item.productSlug}</p>
                      <p className="mt-1 text-xs text-slate-600">
                        Cantidad solicitada: {item.totalRequestedQuantity} • Líneas: {item.totalQuoteLines}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-slate-900">Productos más vendidos (mes)</h2>
              <div className="mt-4 space-y-2">
                {data.monthlySalesStats.topSellingProducts.length === 0 ? (
                  <p className="text-sm text-slate-500">No hay ventas completadas este mes.</p>
                ) : (
                  data.monthlySalesStats.topSellingProducts.map((item) => (
                    <div key={`sell-${item.productId}`} className="rounded-lg bg-slate-50 px-3 py-2">
                      <p className="text-sm font-semibold text-slate-900">{item.productName}</p>
                      <p className="text-xs text-slate-500">Cant.: {item.totalQuantity}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-slate-900">Productos más rentables (mes)</h2>
              <div className="mt-4 space-y-2">
                {data.monthlySalesStats.topProfitableProducts.length === 0 ? (
                  <p className="text-sm text-slate-500">No hay datos de rentabilidad este mes.</p>
                ) : (
                  data.monthlySalesStats.topProfitableProducts.map((item) => (
                    <div key={`profit-${item.productId}`} className="rounded-lg bg-slate-50 px-3 py-2">
                      <p className="text-sm font-semibold text-slate-900">{item.productName}</p>
                      <p className="text-xs text-slate-500">
                        Ganancia: {formatMoney(item.totalProfit, monthlyCurrency)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <h2 className="text-lg font-semibold text-slate-900">Solicitudes recientes</h2>
              <div className="mt-4 space-y-2">
                {data.recentQuotes.length === 0 ? (
                  <p className="text-sm text-slate-500">No hay solicitudes recientes.</p>
                ) : (
                  data.recentQuotes.map((quote) => (
                    <Link
                      key={quote.id}
                      href={`/admin/quotes/${quote.id}`}
                      className="block rounded-lg bg-slate-50 px-3 py-2 hover:bg-slate-100"
                    >
                      <p className="text-sm font-semibold text-slate-900">{quote.customerName}</p>
                      <p className="text-xs text-slate-500">
                        {quote.status} • {formatDateTime(quote.createdAt)}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-slate-900">Ventas recientes</h2>
              <div className="mt-4 space-y-2">
                {data.recentSales.length === 0 ? (
                  <p className="text-sm text-slate-500">No hay ventas recientes.</p>
                ) : (
                  data.recentSales.map((sale) => (
                    <Link
                      key={sale.id}
                      href={`/admin/sales/${sale.id}`}
                      className="block rounded-lg bg-slate-50 px-3 py-2 hover:bg-slate-100"
                    >
                      <p className="text-sm font-semibold text-slate-900">{sale.saleNumber}</p>
                      <p className="text-xs text-slate-500">
                        {sale.customerName} • {formatMoney(sale.totalRevenue, sale.currency)}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </section>
  );
}
