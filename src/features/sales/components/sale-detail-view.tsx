"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { PageHeader } from "@/src/components/ui/page-header";
import { SaleStatusBadge } from "@/src/features/sales/components/sale-status-badge";
import { useSaleDetail } from "@/src/features/sales/hooks/use-sale-detail";
import { formatDateTime, formatMoney, formatPercent } from "@/src/features/sales/utils/format";

type SaleDetailViewProps = {
  saleId: string;
};

export function SaleDetailView({ saleId }: SaleDetailViewProps) {
  const { sale, isLoading, error } = useSaleDetail(saleId);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <PageHeader title="Detalle de venta" subtitle="Cargando información de la venta..." />
        <Card className="h-56 animate-pulse bg-slate-100" />
      </section>
    );
  }

  if (!sale) {
    return (
      <Card className="py-14 text-center">
        <h2 className="text-lg font-semibold text-slate-900">Venta no encontrada</h2>
        <p className="mt-2 text-sm text-slate-500">Es posible que la venta haya sido eliminada.</p>
      </Card>
    );
  }

  return (
    <section className="space-y-6">
      <Link
        href="/admin/sales"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="size-4" />
        Volver a ventas
      </Link>

      <PageHeader
        title={sale.saleNumber}
        subtitle={`Completada ${formatDateTime(sale.completedAt)}`}
        action={<SaleStatusBadge status={sale.status} />}
      />

      {error ? (
        <Card>
          <p className="text-sm font-medium text-red-600">{error}</p>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Información del cliente</h2>
            <InfoRow label="Nombre" value={sale.customerName} />
            <InfoRow label="Teléfono" value={sale.customerPhone ?? "--"} />
            <InfoRow label="Correo" value={sale.customerEmail ?? "--"} />
            <InfoRow label="Ciudad" value={sale.customerCity ?? "--"} />
            <InfoRow label="Moneda" value={sale.currency} />
            <InfoRow label="Creada" value={formatDateTime(sale.createdAt)} />
            <InfoRow label="Actualizada" value={formatDateTime(sale.updatedAt)} />
            <InfoRow label="Completada" value={formatDateTime(sale.completedAt)} />
            <InfoRow
              label="Cotización"
              value={sale.quote ? `${sale.quote.code} (${sale.quote.status})` : "--"}
            />
            <InfoRow
              label="Creada por"
              value={sale.createdBy ? `${sale.createdBy.name} (${sale.createdBy.email})` : "--"}
            />
            {sale.notes ? (
              <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                <p className="font-medium text-slate-900">Notas</p>
                <p className="mt-1">{sale.notes}</p>
              </div>
            ) : null}
          </Card>

          <Card className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Resumen de artículos</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2">Producto</th>
                    <th className="px-3 py-2">Variante</th>
                    <th className="px-3 py-2">Cant.</th>
                    <th className="px-3 py-2">Precio unitario</th>
                    <th className="px-3 py-2">Costo unitario</th>
                    <th className="px-3 py-2">Ingresos</th>
                    <th className="px-3 py-2">Ganancia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sale.items.map((item) => (
                    <tr key={item.id} className="text-sm text-slate-700">
                      <td className="px-3 py-3">
                        <p className="font-medium text-slate-900">{item.productNameSnapshot}</p>
                        <p className="text-xs text-slate-500">{item.productSlugSnapshot}</p>
                      </td>
                      <td className="px-3 py-3">
                        {item.sizeSnapshot || "--"} / {item.colorSnapshot || "--"}
                        {item.skuSnapshot ? (
                          <p className="text-xs text-slate-500">{item.skuSnapshot}</p>
                        ) : null}
                      </td>
                      <td className="px-3 py-3">{item.quantity}</td>
                      <td className="px-3 py-3">{formatMoney(item.unitSalePrice, sale.currency)}</td>
                      <td className="px-3 py-3">{formatMoney(item.unitCostSnapshot, sale.currency)}</td>
                      <td className="px-3 py-3">{formatMoney(item.lineRevenue, sale.currency)}</td>
                      <td className="px-3 py-3">{formatMoney(item.lineProfit, sale.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Card className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Totales</h2>
          <InfoRow label="Subtotal" value={formatMoney(sale.subtotal, sale.currency)} />
          <InfoRow label="Descuento" value={formatMoney(sale.discountTotal, sale.currency)} />
          <InfoRow label="Ingresos" value={formatMoney(sale.totalRevenue, sale.currency)} />
          <InfoRow label="Costo" value={formatMoney(sale.totalCost, sale.currency)} />
          <InfoRow label="Ganancia" value={formatMoney(sale.totalProfit, sale.currency)} />
          <InfoRow label="Margen" value={formatPercent(sale.marginPct)} />
        </Card>
      </div>
    </section>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}
