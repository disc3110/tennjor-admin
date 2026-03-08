"use client";

import { useCallback, useEffect, useState } from "react";
import { productsService } from "@/src/features/products/services/products-service";
import type {
  CategoryAdmin,
  CreateAdminProductPayload,
  ProductAdminDetail,
} from "@/src/features/products/types/product";

type UseProductCreateResult = {
  categories: CategoryAdmin[];
  createdProduct: ProductAdminDetail | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  successMessage: string | null;
  createProduct: (payload: CreateAdminProductPayload) => Promise<ProductAdminDetail | null>;
  refetch: () => Promise<void>;
};

export function useProductCreate(): UseProductCreateResult {
  const [categories, setCategories] = useState<CategoryAdmin[]>([]);
  const [createdProduct, setCreatedProduct] = useState<ProductAdminDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await productsService.listCategories();
      setCategories(response.data);
    } catch {
      setError("Unable to load categories.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (payload: CreateAdminProductPayload) => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await productsService.create(payload);
      setCreatedProduct(response.data);
      setSuccessMessage(response.message);
      return response.data;
    } catch {
      setError("Unable to create product.");
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories().catch(() => {
      // Request errors are handled in hook state.
    });
  }, [fetchCategories]);

  return {
    categories,
    createdProduct,
    isLoading,
    isSaving,
    error,
    successMessage,
    createProduct,
    refetch: fetchCategories,
  };
}
