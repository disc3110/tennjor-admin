"use client";

import { useCallback, useEffect, useState } from "react";
import { salesService } from "@/src/features/sales/services/sales-service";
import type { GetSalesStatsQuery, SalesStatsData } from "@/src/features/sales/types/sale";

type UseSalesStatsResult = {
  stats: SalesStatsData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useSalesStats(query: GetSalesStatsQuery): UseSalesStatsResult {
  const [stats, setStats] = useState<SalesStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { period, year, month, dateFrom, dateTo, status } = query;

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await salesService.getStats({
        period,
        year,
        month,
        dateFrom,
        dateTo,
        status,
      });
      setStats(response.data);
    } catch {
      setError("No se pudieron cargar las estadísticas de ventas en este momento.");
    } finally {
      setIsLoading(false);
    }
  }, [dateFrom, dateTo, month, period, status, year]);

  useEffect(() => {
    loadStats().catch(() => {
      // State handles fetch errors.
    });
  }, [loadStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: loadStats,
  };
}
