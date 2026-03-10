"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/src/features/auth/context/auth-context";
import { quotesService } from "@/src/features/quotes/services/quotes-service";
import { ApiClientError } from "@/src/services/api-client";
import type {
  AdminQuoteRequestDetail,
  ConvertQuoteRequestToSalesQuoteResponse,
  QuoteRequestStatus,
  UpdateAdminQuoteRequestStatusPayload,
} from "@/src/features/quotes/types/quote";

type UseQuoteDetailResult = {
  quote: AdminQuoteRequestDetail | null;
  isLoading: boolean;
  isSaving: boolean;
  isConverting: boolean;
  error: string | null;
  successMessage: string | null;
  refetch: () => Promise<void>;
  saveStatusAndNote: (payload: UpdateAdminQuoteRequestStatusPayload) => Promise<void>;
  convertToSalesQuote: () => Promise<{
    data: ConvertQuoteRequestToSalesQuoteResponse["data"] | null;
    errorMessage: string | null;
  }>;
};

export function useQuoteDetail(id: string): UseQuoteDetailResult {
  const { user } = useAuth();
  const [quote, setQuote] = useState<AdminQuoteRequestDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchQuote = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await quotesService.getById(id);
      setQuote(response.data);
    } catch {
      setError("No se pudieron cargar los detalles de la cotización.");
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
        const actorName = user?.name?.trim() || user?.email?.trim() || "Administrador";
        const trimmedNote = payload.internalNotes?.trim();
        const formattedPayload = trimmedNote
          ? { ...payload, internalNotes: `${actorName}: ${trimmedNote}` }
          : { status: payload.status };

        const response = await quotesService.updateStatus(id, formattedPayload);
        setQuote(response.data);
        setSuccessMessage(response.message);
      } catch {
        setError("No se pudo actualizar el estado de la cotización.");
      } finally {
        setIsSaving(false);
      }
    },
    [id, user?.email, user?.name],
  );

  const convertToSalesQuote = useCallback(async () => {
    setIsConverting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await quotesService.convertToSalesQuote(id);
      setSuccessMessage("Cotización convertida a cotización de venta");
      return { data: response.data, errorMessage: null };
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.status === 400) {
          setError("Esta cotización ya fue convertida.");
          return { data: null, errorMessage: "Esta cotización ya fue convertida." };
        }
        if (err.status === 404) {
          setError("La cotización no existe.");
          return { data: null, errorMessage: "La cotización no existe." };
        }
      }
      setError("No se pudo convertir la cotización.");
      return { data: null, errorMessage: "No se pudo convertir la cotización." };
    } finally {
      setIsConverting(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuote().catch(() => {
      // Request errors are handled in fetchQuote state.
    });
  }, [fetchQuote]);

  return {
    quote,
    isLoading,
    isSaving,
    isConverting,
    error,
    successMessage,
    refetch: fetchQuote,
    saveStatusAndNote,
    convertToSalesQuote,
  };
}
