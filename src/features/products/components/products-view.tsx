"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download, Plus, RotateCw, Search } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { PageHeader } from "@/src/components/ui/page-header";
import { ProductsEmptyState } from "@/src/features/products/components/products-empty-state";
import { ProductsLoadingState } from "@/src/features/products/components/products-loading-state";
import { ProductsTable } from "@/src/features/products/components/products-table";
import { useProductsExport } from "@/src/features/products/hooks/use-products-export";
import { useProducts } from "@/src/features/products/hooks/use-products";

type StatusFilter = "all" | "active" | "inactive";

function parseStatusFilter(value: string | null): StatusFilter {
  if (value === "active" || value === "inactive") return value;
  return "all";
}

export function ProductsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const statusFilter = parseStatusFilter(searchParams.get("status"));
  const searchQuery = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const { isExporting, exportError, exportCsv } = useProductsExport();

  const {
    products,
    meta,
    isLoading,
    isUpdating,
    error,
    refetch,
    toggleProductActive,
  } = useProducts({
    page: 1,
    limit: 20,
    search: searchQuery || undefined,
    isActive:
      statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined,
  });

  const updateQuery = (next: { status?: StatusFilter; search?: string }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!next.status || next.status === "all") params.delete("status");
    else params.set("status", next.status);

    if (!next.search) params.delete("search");
    else params.set("search", next.search);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const search = String(formData.get("search") ?? "").trim();
    updateQuery({ status: statusFilter, search });
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title="Products"
        subtitle="Manage catalog visibility, statuses, and product overview."
        action={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Link
              href="/admin/products/new"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-700"
            >
              <Plus className="size-4" />
              New Product
            </Link>
            <Button
              variant="secondary"
              disabled={isExporting}
              iconLeft={<Download className="size-4" />}
              onClick={() => {
                exportCsv({
                  search: searchQuery || undefined,
                  categoryId: categoryId || undefined,
                  isActive:
                    statusFilter === "active"
                      ? true
                      : statusFilter === "inactive"
                        ? false
                        : undefined,
                }).catch(() => {
                  // Errors are handled in hook state.
                });
              }}
              className="w-full sm:w-auto"
            >
              {isExporting ? "Exporting..." : "Export CSV"}
            </Button>
            <Button
              variant="secondary"
              iconLeft={<RotateCw className="size-4" />}
              onClick={() => {
                refetch().catch(() => {
                  // Refetch errors are captured in hook state.
                });
              }}
              className="w-full sm:w-auto"
            >
              Refresh
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === "all" ? "primary" : "secondary"}
              onClick={() => updateQuery({ status: "all", search: searchQuery })}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "active" ? "primary" : "secondary"}
              onClick={() => updateQuery({ status: "active", search: searchQuery })}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === "inactive" ? "primary" : "secondary"}
              onClick={() => updateQuery({ status: "inactive", search: searchQuery })}
            >
              Inactive
            </Button>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex w-full max-w-md gap-2">
            <Input
              name="search"
              defaultValue={searchQuery}
              placeholder="Search by product name or slug"
              className="h-10"
            />
            <Button type="submit" variant="secondary" iconLeft={<Search className="size-4" />}>
              Search
            </Button>
          </form>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total</p>
          <p className="text-3xl font-semibold text-slate-900">{meta?.total ?? "--"}</p>
        </Card>
        <Card className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Page</p>
          <p className="text-3xl font-semibold text-slate-900">{meta?.page ?? "--"}</p>
        </Card>
        <Card className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Pages</p>
          <p className="text-3xl font-semibold text-slate-900">{meta?.totalPages ?? "--"}</p>
        </Card>
      </div>

      {isLoading ? <ProductsLoadingState /> : null}

      {!isLoading && error ? (
        <Card className="py-14 text-center">
          <h2 className="text-lg font-semibold text-slate-900">Could not load products</h2>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
        </Card>
      ) : null}

      {!isLoading && !error && products.length === 0 ? <ProductsEmptyState /> : null}

      {!isLoading && !error && products.length > 0 ? (
        <Card className="p-0">
          <ProductsTable
            products={products}
            isUpdating={isUpdating}
            onToggleStatus={(product) => {
              toggleProductActive(product).catch(() => {
                // Errors are handled in hook state.
              });
            }}
          />
        </Card>
      ) : null}
    </section>
  );
}
