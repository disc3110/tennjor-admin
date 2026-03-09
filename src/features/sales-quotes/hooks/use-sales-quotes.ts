"use client";

import { useCallback, useEffect, useState } from "react";
import { salesQuotesService } from "@/src/features/sales-quotes/services/sales-quotes-service";
import type {
  GetInternalSaleQuotesQuery,
  InternalSaleQuoteSummary,
  InternalSaleQuotesMeta,
} from "@/src/features/sales-quotes/types/sales-quote";

type UseSalesQuotesResult = {
  quotes: InternalSaleQuoteSummary[];
  meta: InternalSaleQuotesMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useSalesQuotes(query: GetInternalSaleQuotesQuery): UseSalesQuotesResult {
  const [quotes, setQuotes] = useState<InternalSaleQuoteSummary[]>([]);
  const [meta, setMeta] = useState<InternalSaleQuotesMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { status, search, page, limit } = query;

  const loadQuotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await salesQuotesService.list({ status, search, page, limit });
      setQuotes(response.data);
      setMeta(response.meta);
    } catch {
      setError("Unable to load sales quotes right now.");
    } finally {
      setIsLoading(false);
    }
  }, [limit, page, search, status]);

  useEffect(() => {
    loadQuotes().catch(() => {
      // State handles fetch errors.
    });
  }, [loadQuotes]);

  return {
    quotes,
    meta,
    isLoading,
    error,
    refetch: loadQuotes,
  };
}
