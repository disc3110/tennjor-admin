"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/src/features/auth/context/auth-context";
import { quotesService } from "@/src/features/quotes/services/quotes-service";
import type {
  AdminQuoteRequestDetail,
  QuoteRequestStatus,
  UpdateAdminQuoteRequestStatusPayload,
} from "@/src/features/quotes/types/quote";

type UseQuoteDetailResult = {
  quote: AdminQuoteRequestDetail | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  successMessage: string | null;
  refetch: () => Promise<void>;
  saveStatusAndNote: (payload: UpdateAdminQuoteRequestStatusPayload) => Promise<void>;
};

export function useQuoteDetail(id: string): UseQuoteDetailResult {
  const { user } = useAuth();
  const [quote, setQuote] = useState<AdminQuoteRequestDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchQuote = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await quotesService.getById(id);
      setQuote(response.data);
    } catch {
      setError("Unable to load quote details.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const saveStatusAndNote = useCallback(
    async (payload: { status: QuoteRequestStatus; internalNotes?: string }) => {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const actorName = user?.name?.trim() || user?.email?.trim() || "Admin";
        const trimmedNote = payload.internalNotes?.trim();
        const formattedPayload = trimmedNote
          ? { ...payload, internalNotes: `${actorName}: ${trimmedNote}` }
          : { status: payload.status };

        const response = await quotesService.updateStatus(id, formattedPayload);
        setQuote(response.data);
        setSuccessMessage(response.message);
      } catch {
        setError("Unable to update quote status.");
      } finally {
        setIsSaving(false);
      }
    },
    [id, user?.email, user?.name],
  );

  useEffect(() => {
    fetchQuote().catch(() => {
      // Request errors are handled in fetchQuote state.
    });
  }, [fetchQuote]);

  return {
    quote,
    isLoading,
    isSaving,
    error,
    successMessage,
    refetch: fetchQuote,
    saveStatusAndNote,
  };
}
