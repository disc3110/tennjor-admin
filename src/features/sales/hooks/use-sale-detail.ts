"use client";

import { useCallback, useEffect, useState } from "react";
import { salesService } from "@/src/features/sales/services/sales-service";
import type { CompletedSaleDetail } from "@/src/features/sales/types/sale";

type UseSaleDetailResult = {
  sale: CompletedSaleDetail | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useSaleDetail(saleId: string): UseSaleDetailResult {
  const [sale, setSale] = useState<CompletedSaleDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSale = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await salesService.getById(saleId);
      setSale(response.data);
    } catch {
      setError("Unable to load completed sale detail.");
    } finally {
      setIsLoading(false);
    }
  }, [saleId]);

  useEffect(() => {
    loadSale().catch(() => {
      // State handles fetch errors.
    });
  }, [loadSale]);

  return {
    sale,
    isLoading,
    error,
    refetch: loadSale,
  };
}
