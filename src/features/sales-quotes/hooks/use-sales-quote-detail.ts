"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  productCostById: Record<string, { baseCost: string | number | null; costCurrency: string | null }>;
  ensureProductCost: (productId: string) => Promise<void>;
  resolvingProductCostIds: Record<string, true>;
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
  addInternalNote: (message: string) => Promise<void>;
  completeSale: () => Promise<CompleteInternalSaleQuoteResponse["data"] | null>;
};

export function useSalesQuoteDetail(quoteId: string): UseSalesQuoteDetailResult {
  const [quote, setQuote] = useState<InternalSaleQuoteDetail | null>(null);
  const [productOptions, setProductOptions] = useState<ProductOptionForInternalQuote[]>([]);
  const [productCostById, setProductCostById] = useState<
    Record<string, { baseCost: string | number | null; costCurrency: string | null }>
  >({});
  const [resolvingProductCostIds, setResolvingProductCostIds] = useState<Record<string, true>>({});
  const resolvedProductCostIdsRef = useRef<Record<string, true>>({});
  const resolvingProductCostIdsRef = useRef<Record<string, true>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const hasDefinedCost = useCallback((value: string | number | null | undefined) => {
    if (value == null) return false;
    if (typeof value === "string") return value.trim().length > 0;
    return true;
  }, []);

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
        costCurrency: product.costCurrency,
        variants: product.variants,
      })));
      setProductCostById(
        productsResponse.data.reduce<Record<string, { baseCost: string | number | null; costCurrency: string | null }>>(
          (acc, product) => {
            acc[product.id] = {
              baseCost: product.baseCost ?? null,
              costCurrency: product.costCurrency ?? null,
            };
            return acc;
          },
          {},
        ),
      );
    } catch {
      setError("No se pudieron cargar los detalles de la cotización de venta.");
    } finally {
      setIsLoading(false);
    }
  }, [quoteId]);

  const ensureProductCost = useCallback(async (productId: string) => {
    if (!productId) return;

    const optionFromList = productOptions.find((product) => product.id === productId);
    if (optionFromList && hasDefinedCost(optionFromList.baseCost)) {
      setProductCostById((previous) => ({
        ...previous,
        [productId]: {
          baseCost: optionFromList.baseCost ?? null,
          costCurrency: optionFromList.costCurrency ?? null,
        },
      }));
      resolvedProductCostIdsRef.current = {
        ...resolvedProductCostIdsRef.current,
        [productId]: true,
      };
      return;
    }

    if (resolvedProductCostIdsRef.current[productId] || resolvingProductCostIdsRef.current[productId]) return;

    setResolvingProductCostIds((previous) => ({ ...previous, [productId]: true }));
    resolvingProductCostIdsRef.current = {
      ...resolvingProductCostIdsRef.current,
      [productId]: true,
    };
    try {
      const response = await salesQuotesService.getProductOptionById(productId);
      setProductCostById((previous) => ({
        ...previous,
        [productId]: {
          baseCost: response.data.baseCost ?? null,
          costCurrency: response.data.costCurrency ?? null,
        },
      }));
    } catch {
      // Keep silent; UI will show fallback text.
    } finally {
      resolvedProductCostIdsRef.current = {
        ...resolvedProductCostIdsRef.current,
        [productId]: true,
      };
      setResolvingProductCostIds((previous) => {
        const next = { ...previous };
        delete next[productId];
        return next;
      });
      const nextResolving = { ...resolvingProductCostIdsRef.current };
      delete nextResolving[productId];
      resolvingProductCostIdsRef.current = nextResolving;
    }
  }, [hasDefinedCost, productOptions]);

  const withMutationState = useCallback(async (operation: () => Promise<void>) => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await operation();
    } catch {
      setError("No se pudo actualizar la cotización de venta.");
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateHeader = useCallback(
    async (payload: UpdateInternalSaleQuotePayload) => {
      await withMutationState(async () => {
        const response = await salesQuotesService.update(quoteId, payload);
        setQuote(response.data);
        setSuccessMessage("Encabezado de cotización actualizado correctamente.");
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
        setSuccessMessage("Artículo de cotización agregado correctamente.");
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
        setSuccessMessage("Artículo de cotización actualizado correctamente.");
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
        setSuccessMessage("Artículo de cotización eliminado correctamente.");
      });
    },
    [quoteId, withMutationState],
  );

  const recalculate = useCallback(async () => {
    await withMutationState(async () => {
      await salesQuotesService.recalculate(quoteId);
      const detail = await salesQuotesService.getById(quoteId);
      setQuote(detail.data);
      setSuccessMessage("Totales de cotización recalculados correctamente.");
    });
  }, [quoteId, withMutationState]);

  const addInternalNote = useCallback(async (message: string) => {
    await withMutationState(async () => {
      await salesQuotesService.addInternalNote(quoteId, { message });
      const detail = await salesQuotesService.getById(quoteId);
      setQuote(detail.data);
      setSuccessMessage("Nota interna agregada correctamente.");
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
      setError("No se pudo completar la venta desde esta cotización.");
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
    productCostById,
    ensureProductCost,
    resolvingProductCostIds,
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
    addInternalNote,
    completeSale,
  };
}
