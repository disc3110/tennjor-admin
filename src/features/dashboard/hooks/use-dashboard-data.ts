"use client";

import { useCallback, useEffect, useState } from "react";
import { categoriesService } from "@/src/features/categories/services/categories-service";
import { dashboardService } from "@/src/features/dashboard/services/dashboard-service";
import type { DashboardStatsResponse } from "@/src/features/dashboard/types/dashboard";
import { productsService } from "@/src/features/products/services/products-service";
import { quotesService } from "@/src/features/quotes/services/quotes-service";
import type { AdminQuoteRequest } from "@/src/features/quotes/types/quote";
import { salesService } from "@/src/features/sales/services/sales-service";
import type { CompletedSaleSummary, SalesStatsData } from "@/src/features/sales/types/sale";

type DashboardData = {
  totalProducts: number;
  activeCategories: number;
  totalQuotes: number;
  newQuotes: number;
  quotesThisWeek: number;
  monthlySalesStats: SalesStatsData;
  quoteStatusBreakdown: Record<string, number>;
  topRequestedProducts: DashboardStatsResponse["data"]["topRequestedProducts"];
  recentQuotes: AdminQuoteRequest[];
  recentSales: CompletedSaleSummary[];
};

type UseDashboardDataResult = {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useDashboardData(): UseDashboardDataResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [dashboardStats, salesStats, productsList, activeCategories, recentQuotes, recentSales] =
        await Promise.all([
          dashboardService.getStats(),
          salesService.getStats({ period: "month" }),
          productsService.list({ page: 1, limit: 1 }),
          categoriesService.list({ isActive: true }),
          quotesService.list({ page: 1, limit: 5 }),
          salesService.list({ page: 1, limit: 5, sortBy: "completedAt", sortOrder: "desc" }),
        ]);

      setData({
        totalProducts: productsList.meta.total,
        activeCategories: activeCategories.data.length,
        totalQuotes: dashboardStats.data.summary.totalQuotes,
        newQuotes: dashboardStats.data.summary.newQuotes,
        quotesThisWeek: dashboardStats.data.summary.quotesThisWeek,
        monthlySalesStats: salesStats.data,
        quoteStatusBreakdown: dashboardStats.data.quotesByStatus,
        topRequestedProducts: dashboardStats.data.topRequestedProducts,
        recentQuotes: recentQuotes.data,
        recentSales: recentSales.data,
      });
    } catch {
      setError("No se pudieron cargar las métricas del panel en este momento.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData().catch(() => {
      // State handles request errors.
    });
  }, [loadDashboardData]);

  return {
    data,
    isLoading,
    error,
    refetch: loadDashboardData,
  };
}
