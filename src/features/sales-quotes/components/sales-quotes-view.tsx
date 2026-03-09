"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, RotateCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { PageHeader } from "@/src/components/ui/page-header";
import { SalesQuotesTable } from "@/src/features/sales-quotes/components/sales-quotes-table";
import { useSalesQuotes } from "@/src/features/sales-quotes/hooks/use-sales-quotes";
import type { InternalSaleQuoteStatus } from "@/src/features/sales-quotes/types/sales-quote";

type SalesQuoteStatusFilter = "all" | InternalSaleQuoteStatus;

const statusOptions: SalesQuoteStatusFilter[] = [
  "all",
  "DRAFT",
  "SENT",
  "APPROVED",
  "REJECTED",
  "EXPIRED",
  "COMPLETED",
];

function parseStatus(value: string | null): SalesQuoteStatusFilter {
  if (
    value === "DRAFT" ||
    value === "SENT" ||
    value === "APPROVED" ||
    value === "REJECTED" ||
    value === "EXPIRED" ||
    value === "COMPLETED"
  ) {
    return value;
  }
  return "all";
}

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

export function SalesQuotesView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const statusFilter = parseStatus(searchParams.get("status"));
  const search = searchParams.get("search") ?? "";
  const page = parsePositiveInt(searchParams.get("page"), 1);
  const limit = parsePositiveInt(searchParams.get("limit"), 20);

  const { quotes, meta, isLoading, error, refetch } = useSalesQuotes({
    status: statusFilter === "all" ? undefined : statusFilter,
    search: search || undefined,
    page,
    limit,
  });

  const updateQuery = (next: {
    status?: SalesQuoteStatusFilter;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!next.status || next.status === "all") params.delete("status");
    else params.set("status", next.status);

    if (!next.search) params.delete("search");
    else params.set("search", next.search);

    if (!next.page || next.page === 1) params.delete("page");
    else params.set("page", String(next.page));

    if (!next.limit || next.limit === 20) params.delete("limit");
    else params.set("limit", String(next.limit));

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title="Cotizaciones de venta"
        subtitle="Cotizaciones internas usadas por el equipo comercial antes del cierre final."
        action={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Link
              href="/admin/sales-quotes/new"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-700"
            >
              <Plus className="size-4" />
              Nueva cotización de venta
            </Link>
            <Button
              variant="secondary"
              iconLeft={<RotateCw className="size-4" />}
              onClick={() => {
                refetch().catch(() => {
                  // Refetch errors are handled in hook state.
                });
              }}
              className="w-full sm:w-auto"
            >
              Actualizar
            </Button>
          </div>
        }
      />

      <Card>
        <div className="grid gap-3 lg:grid-cols-4">
          <select
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
            value={statusFilter}
            onChange={(event) =>
              updateQuery({
                status: event.target.value as SalesQuoteStatusFilter,
                search,
                page: 1,
                limit,
              })
            }
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "Todos los estados" : option}
              </option>
            ))}
          </select>

          <Input
            value={search}
            onChange={(event) =>
              updateQuery({
                status: statusFilter,
                search: event.target.value,
                page: 1,
                limit,
              })
            }
            placeholder="Buscar por código o cliente"
            className="h-10"
          />

          <Input
            type="number"
            min={1}
            value={page}
            onChange={(event) =>
              updateQuery({
                status: statusFilter,
                search,
                page: parsePositiveInt(event.target.value, 1),
                limit,
              })
            }
            placeholder="Página"
            className="h-10"
          />

          <Input
            type="number"
            min={1}
            value={limit}
            onChange={(event) =>
              updateQuery({
                status: statusFilter,
                search,
                page: 1,
                limit: parsePositiveInt(event.target.value, 20),
              })
            }
            placeholder="Límite"
            className="h-10"
          />
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
          <h2 className="text-lg font-semibold text-slate-900">No se pudieron cargar las cotizaciones de venta</h2>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
        </Card>
      ) : null}

      {!isLoading && !error && quotes.length === 0 ? (
        <Card className="py-14 text-center">
          <h2 className="text-lg font-semibold text-slate-900">No se encontraron cotizaciones de venta</h2>
          <p className="mt-2 text-sm text-slate-500">
            Ajusta los filtros o crea la primera cotización de venta interna.
          </p>
        </Card>
      ) : null}

      {!isLoading && !error && quotes.length > 0 ? (
        <Card className="p-0">
          <SalesQuotesTable quotes={quotes} />
        </Card>
      ) : null}
    </section>
  );
}
