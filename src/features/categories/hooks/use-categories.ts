"use client";

import { useCallback, useEffect, useState } from "react";
import { categoriesService } from "@/src/features/categories/services/categories-service";
import type { CategoryAdmin, CategoryListQuery } from "@/src/features/categories/types/category";

type UseCategoriesResult = {
  categories: CategoryAdmin[];
  isLoading: boolean;
  isUpdating: string | null;
  error: string | null;
  refetch: () => Promise<void>;
  toggleCategoryActive: (category: CategoryAdmin) => Promise<void>;
};

export function useCategories(query: CategoryListQuery = {}): UseCategoriesResult {
  const { search, isActive } = query;
  const [categories, setCategories] = useState<CategoryAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await categoriesService.list({ search });

      // Backend contract supports `isActive`, but runtime behavior can vary.
      const filteredData =
        typeof isActive === "boolean"
          ? response.data.filter((category) => category.isActive === isActive)
          : response.data;

      setCategories(filteredData);
    } catch {
      setError("Unable to load categories right now.");
    } finally {
      setIsLoading(false);
    }
  }, [isActive, search]);

  const toggleCategoryActive = useCallback(async (category: CategoryAdmin) => {
    setIsUpdating(category.id);
    setError(null);

    try {
      const response = await categoriesService.update(category.id, {
        isActive: !category.isActive,
      });
      setCategories((previous) =>
        previous.map((item) => (item.id === category.id ? response.data : item)),
      );
    } catch {
      setError("Unable to update category status.");
    } finally {
      setIsUpdating(null);
    }
  }, []);

  useEffect(() => {
    fetchCategories().catch(() => {
      // Request errors are handled in hook state.
    });
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    isUpdating,
    error,
    refetch: fetchCategories,
    toggleCategoryActive,
  };
}
