"use client";

import { useCallback, useEffect, useState } from "react";
import { productsService } from "@/src/features/products/services/products-service";
import type {
  CategoryAdmin,
  ProductAdminDetail,
  UpdateAdminProductPayload,
} from "@/src/features/products/types/product";

type UseProductEditResult = {
  product: ProductAdminDetail | null;
  categories: CategoryAdmin[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  successMessage: string | null;
  saveProduct: (payload: UpdateAdminProductPayload) => Promise<void>;
  refetch: () => Promise<void>;
};

export function useProductEdit(productId: string): UseProductEditResult {
  const [product, setProduct] = useState<ProductAdminDetail | null>(null);
  const [categories, setCategories] = useState<CategoryAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [productResponse, categoriesResponse] = await Promise.all([
        productsService.getById(productId),
        productsService.listCategories(),
      ]);

      setProduct(productResponse.data);
      setCategories(categoriesResponse.data);
    } catch {
      setError("Unable to load product details.");
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  const saveProduct = useCallback(
    async (payload: UpdateAdminProductPayload) => {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const response = await productsService.update(productId, payload);
        setProduct(response.data);
        setSuccessMessage(response.message);
      } catch {
        setError("Unable to update product.");
      } finally {
        setIsSaving(false);
      }
    },
    [productId],
  );

  useEffect(() => {
    fetchData().catch(() => {
      // Request errors are handled in hook state.
    });
  }, [fetchData]);

  return {
    product,
    categories,
    isLoading,
    isSaving,
    error,
    successMessage,
    saveProduct,
    refetch: fetchData,
  };
}
