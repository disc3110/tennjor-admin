"use client";

import { useCallback, useEffect, useState } from "react";
import { salesService } from "@/src/features/sales/services/sales-service";
import type {
  CompletedSaleSummary,
  CompletedSalesMeta,
  GetCompletedSalesQuery,
} from "@/src/features/sales/types/sale";

type UseSalesResult = {
  sales: CompletedSaleSummary[];
  meta: CompletedSalesMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useSales(query: GetCompletedSalesQuery): UseSalesResult {
  const [sales, setSales] = useState<CompletedSaleSummary[]>([]);
  const [meta, setMeta] = useState<CompletedSalesMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    page,
    limit,
    status,
    customerName,
    saleNumber,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
  } = query;

  const loadSales = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await salesService.list({
        page,
        limit,
        status,
        customerName,
        saleNumber,
        dateFrom,
        dateTo,
        sortBy,
        sortOrder,
      });
      setSales(response.data);
      setMeta(response.meta);
    } catch {
      setError("No se pudieron cargar las ventas completadas en este momento.");
    } finally {
      setIsLoading(false);
    }
  }, [customerName, dateFrom, dateTo, limit, page, saleNumber, sortBy, sortOrder, status]);

  useEffect(() => {
    loadSales().catch(() => {
      // State handles fetch errors.
    });
  }, [loadSales]);

  return {
    sales,
    meta,
    isLoading,
    error,
    refetch: loadSales,
  };
}
