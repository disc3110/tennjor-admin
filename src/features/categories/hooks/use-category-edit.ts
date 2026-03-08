"use client";

import { useCallback, useEffect, useState } from "react";
import { categoriesService } from "@/src/features/categories/services/categories-service";
import type {
  CategoryWithProducts,
  UpdateCategoryPayload,
} from "@/src/features/categories/types/category";

type UseCategoryEditResult = {
  category: CategoryWithProducts | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  successMessage: string | null;
  saveCategory: (payload: UpdateCategoryPayload) => Promise<void>;
  deleteCategory: () => Promise<void>;
  refetch: () => Promise<void>;
};

export function useCategoryEdit(categoryId: string): UseCategoryEditResult {
  const [category, setCategory] = useState<CategoryWithProducts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchCategory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await categoriesService.getById(categoryId);
      setCategory(response.data);
    } catch {
      setError("Unable to load category details.");
    } finally {
      setIsLoading(false);
    }
  }, [categoryId]);

  const saveCategory = useCallback(
    async (payload: UpdateCategoryPayload) => {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const response = await categoriesService.update(categoryId, payload);
        setCategory((previous) =>
          previous
            ? {
                ...previous,
                ...response.data,
              }
            : null,
        );
        setSuccessMessage(response.message);
      } catch {
        setError("Unable to update category.");
      } finally {
        setIsSaving(false);
      }
    },
    [categoryId],
  );

  const deleteCategory = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await categoriesService.delete(categoryId);
      if (response.data.cloudinaryCleanupPendingPublicIds.length > 0) {
        setSuccessMessage(
          `Category deleted. Pending cloud cleanup: ${response.data.cloudinaryCleanupPendingPublicIds.length} image(s).`,
        );
      } else {
        setSuccessMessage("Category deleted successfully.");
      }
    } catch {
      setError("Unable to delete category. It may contain products linked to quote requests.");
      throw new Error("delete_failed");
    } finally {
      setIsSaving(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchCategory().catch(() => {
      // Request errors are handled in hook state.
    });
  }, [fetchCategory]);

  return {
    category,
    isLoading,
    isSaving,
    error,
    successMessage,
    saveCategory,
    deleteCategory,
    refetch: fetchCategory,
  };
}
