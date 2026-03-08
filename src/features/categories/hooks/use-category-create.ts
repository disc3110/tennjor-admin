"use client";

import { useState } from "react";
import { categoriesService } from "@/src/features/categories/services/categories-service";
import type {
  CategoryAdmin,
  CreateCategoryPayload,
} from "@/src/features/categories/types/category";

type UseCategoryCreateResult = {
  isSaving: boolean;
  error: string | null;
  successMessage: string | null;
  createdCategory: CategoryAdmin | null;
  createCategory: (payload: CreateCategoryPayload) => Promise<CategoryAdmin | null>;
};

export function useCategoryCreate(): UseCategoryCreateResult {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createdCategory, setCreatedCategory] = useState<CategoryAdmin | null>(null);

  const createCategory = async (payload: CreateCategoryPayload) => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await categoriesService.create(payload);
      setCreatedCategory(response.data);
      setSuccessMessage(response.message);
      return response.data;
    } catch {
      setError("Unable to create category.");
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    error,
    successMessage,
    createdCategory,
    createCategory,
  };
}
