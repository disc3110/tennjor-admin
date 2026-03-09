"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { salesQuotesService } from "@/src/features/sales-quotes/services/sales-quotes-service";
import type {
  CompleteInternalSaleQuoteResponse,
  CreateInternalSaleQuoteItemPayload,
  InternalSaleQuoteDetail,
  ProductOptionForInternalQuote,
  UpdateInternalSaleQuoteItemPayload,
  UpdateInternalSaleQuotePayload,
} from "@/src/features/sales-quotes/types/sales-quote";

type UseSalesQuoteDetailResult = {
  quote: InternalSaleQuoteDetail | null;
  productOptions: ProductOptionForInternalQuote[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  successMessage: string | null;
  refetch: () => Promise<void>;
  updateHeader: (payload: UpdateInternalSaleQuotePayload) => Promise<void>;
  addItem: (payload: CreateInternalSaleQuoteItemPayload) => Promise<void>;
  updateItem: (itemId: string, payload: UpdateInternalSaleQuoteItemPayload) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  recalculate: () => Promise<void>;
  completeSale: () => Promise<CompleteInternalSaleQuoteResponse["data"] | null>;
};

export function useSalesQuoteDetail(quoteId: string): UseSalesQuoteDetailResult {
  const [quote, setQuote] = useState<InternalSaleQuoteDetail | null>(null);
  const [productOptions, setProductOptions] = useState<ProductOptionForInternalQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadQuote = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [quoteResponse, productsResponse] = await Promise.all([
        salesQuotesService.getById(quoteId),
        salesQuotesService.listProductOptions(),
      ]);

      setQuote(quoteResponse.data);
      setProductOptions(productsResponse.data.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        baseCost: product.baseCost,
        variants: product.variants,
      })));
    } catch {
      setError("Unable to load sales quote detail.");
    } finally {
      setIsLoading(false);
    }
  }, [quoteId]);

  const withMutationState = useCallback(async (operation: () => Promise<void>) => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await operation();
    } catch {
      setError("Unable to update sales quote.");
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateHeader = useCallback(
    async (payload: UpdateInternalSaleQuotePayload) => {
      await withMutationState(async () => {
        const response = await salesQuotesService.update(quoteId, payload);
        setQuote(response.data);
        setSuccessMessage("Quote header updated successfully.");
      });
    },
    [quoteId, withMutationState],
  );

  const addItem = useCallback(
    async (payload: CreateInternalSaleQuoteItemPayload) => {
      await withMutationState(async () => {
        await salesQuotesService.addItem(quoteId, payload);
        const detail = await salesQuotesService.getById(quoteId);
        setQuote(detail.data);
        setSuccessMessage("Quote item added successfully.");
      });
    },
    [quoteId, withMutationState],
  );

  const updateItem = useCallback(
    async (itemId: string, payload: UpdateInternalSaleQuoteItemPayload) => {
      await withMutationState(async () => {
        await salesQuotesService.updateItem(quoteId, itemId, payload);
        const detail = await salesQuotesService.getById(quoteId);
        setQuote(detail.data);
        setSuccessMessage("Quote item updated successfully.");
      });
    },
    [quoteId, withMutationState],
  );

  const deleteItem = useCallback(
    async (itemId: string) => {
      await withMutationState(async () => {
        await salesQuotesService.deleteItem(quoteId, itemId);
        const detail = await salesQuotesService.getById(quoteId);
        setQuote(detail.data);
        setSuccessMessage("Quote item deleted successfully.");
      });
    },
    [quoteId, withMutationState],
  );

  const recalculate = useCallback(async () => {
    await withMutationState(async () => {
      await salesQuotesService.recalculate(quoteId);
      const detail = await salesQuotesService.getById(quoteId);
      setQuote(detail.data);
      setSuccessMessage("Quote totals recalculated successfully.");
    });
  }, [quoteId, withMutationState]);

  const completeSale = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await salesQuotesService.completeSale(quoteId);
      const detail = await salesQuotesService.getById(quoteId);
      setQuote(detail.data);
      setSuccessMessage(response.message);
      return response.data;
    } catch {
      setError("Unable to complete sale from this quote.");
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [quoteId]);

  useEffect(() => {
    loadQuote().catch(() => {
      // State handles fetch errors.
    });
  }, [loadQuote]);

  const stableProducts = useMemo(() => productOptions, [productOptions]);

  return {
    quote,
    productOptions: stableProducts,
    isLoading,
    isSaving,
    error,
    successMessage,
    refetch: loadQuote,
    updateHeader,
    addItem,
    updateItem,
    deleteItem,
    recalculate,
    completeSale,
  };
}
