"use client";

import { useCallback, useEffect, useState } from "react";
import { quotesService } from "@/src/features/quotes/services/quotes-service";
import type {
  AdminQuoteRequest,
  AdminQuoteRequestsMeta,
  GetAdminQuoteRequestsQuery,
} from "@/src/features/quotes/types/quote";

type UseQuotesResult = {
  quotes: AdminQuoteRequest[];
  meta: AdminQuoteRequestsMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useQuotes(query: GetAdminQuoteRequestsQuery = {}): UseQuotesResult {
  const { status, search, page, limit } = query;
  const [quotes, setQuotes] = useState<AdminQuoteRequest[]>([]);
  const [meta, setMeta] = useState<AdminQuoteRequestsMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await quotesService.list({ status, search, page, limit });
      setQuotes(response.data);
      setMeta(response.meta);
    } catch {
      setError("No se pudieron cargar las cotizaciones en este momento.");
    } finally {
      setIsLoading(false);
    }
  }, [limit, page, search, status]);

  useEffect(() => {
    fetchQuotes().catch(() => {
      // Request errors are handled in fetchQuotes state.
    });
  }, [fetchQuotes]);

  return {
    quotes,
    meta,
    isLoading,
    error,
    refetch: fetchQuotes,
  };
}
