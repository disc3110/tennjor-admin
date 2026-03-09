"use client";

import { useState } from "react";
import { salesQuotesService } from "@/src/features/sales-quotes/services/sales-quotes-service";
import type {
  CreateInternalSaleQuotePayload,
  InternalSaleQuoteSummary,
} from "@/src/features/sales-quotes/types/sales-quote";

type UseSalesQuoteCreateResult = {
  isSaving: boolean;
  error: string | null;
  successMessage: string | null;
  createdQuote: InternalSaleQuoteSummary | null;
  createQuote: (payload: CreateInternalSaleQuotePayload) => Promise<InternalSaleQuoteSummary | null>;
};

export function useSalesQuoteCreate(): UseSalesQuoteCreateResult {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createdQuote, setCreatedQuote] = useState<InternalSaleQuoteSummary | null>(null);

  const createQuote = async (payload: CreateInternalSaleQuotePayload) => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await salesQuotesService.create(payload);
      setCreatedQuote(response.data);
      setSuccessMessage(response.message);
      return response.data;
    } catch {
      setError("Unable to create sales quote.");
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    error,
    successMessage,
    createdQuote,
    createQuote,
  };
}
