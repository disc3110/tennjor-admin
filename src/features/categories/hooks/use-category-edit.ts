"use client";

import { useCallback, useEffect, useState } from "react";
import { categoriesService } from "@/src/features/categories/services/categories-service";
import type {
  CategoryImageUploadSlot,
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
  uploadCategoryImage: (slot: CategoryImageUploadSlot, file: File) => Promise<void>;
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
      setError("No se pudieron cargar los detalles de la categoría.");
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
        setError("No se pudo actualizar la categoría.");
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
          `Categoría eliminada. Limpieza de nube pendiente: ${response.data.cloudinaryCleanupPendingPublicIds.length} imagen(es).`,
        );
      } else {
        setSuccessMessage("Categoría eliminada correctamente.");
      }
    } catch {
      setError("No se pudo eliminar la categoría. Puede contener productos vinculados a solicitudes de cotización.");
      throw new Error("delete_failed");
    } finally {
      setIsSaving(false);
    }
  }, [categoryId]);

  const uploadCategoryImage = useCallback(
    async (slot: CategoryImageUploadSlot, file: File) => {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const response =
          slot === "web"
            ? await categoriesService.uploadWebImage(categoryId, file)
            : await categoriesService.uploadMobileImage(categoryId, file);

        setCategory((previous) =>
          previous
            ? {
                ...previous,
                ...response.data.category,
              }
            : null,
        );

        if (response.data.previousAssetCleanup.error) {
          setSuccessMessage(
            `${response.message} Cleanup warning: ${response.data.previousAssetCleanup.error}`,
          );
        } else {
          setSuccessMessage(response.message);
        }
      } catch {
        setError("No se pudo subir la imagen de la categoría.");
      } finally {
        setIsSaving(false);
      }
    },
    [categoryId],
  );

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
    uploadCategoryImage,
    deleteCategory,
    refetch: fetchCategory,
  };
}
