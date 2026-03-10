"use client";

import { useState } from "react";
import { categoriesService } from "@/src/features/categories/services/categories-service";
import type {
  CategoryAdmin,
  CreateCategoryPayload,
} from "@/src/features/categories/types/category";

type CreateCategoryMediaInput = {
  webFile?: File;
  mobileFile?: File;
};

type UseCategoryCreateResult = {
  isSaving: boolean;
  error: string | null;
  successMessage: string | null;
  createdCategory: CategoryAdmin | null;
  createCategoryWithOptionalImages: (
    payload: CreateCategoryPayload,
    media?: CreateCategoryMediaInput,
  ) => Promise<{ category: CategoryAdmin | null; imageUploadFailed: boolean }>;
};

export function useCategoryCreate(): UseCategoryCreateResult {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createdCategory, setCreatedCategory] = useState<CategoryAdmin | null>(null);

  const createCategoryWithOptionalImages = async (
    payload: CreateCategoryPayload,
    media?: CreateCategoryMediaInput,
  ) => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const createResponse = await categoriesService.create(payload);
      const category = createResponse.data;
      setCreatedCategory(category);

      const warnings: string[] = [];
      let imageUploadFailed = false;

      if (media?.webFile) {
        try {
          await categoriesService.uploadWebImage(category.id, media.webFile);
        } catch {
          imageUploadFailed = true;
          warnings.push("falló la carga de imagen web");
        }
      }

      if (media?.mobileFile) {
        try {
          await categoriesService.uploadMobileImage(category.id, media.mobileFile);
        } catch {
          imageUploadFailed = true;
          warnings.push("falló la carga de imagen móvil");
        }
      }

      if (warnings.length > 0) {
        setSuccessMessage(
          `Categoría creada correctamente, pero ${warnings.join(" y ")}. Puedes reintentar en la página de edición.`,
        );
      } else {
        setSuccessMessage(createResponse.message);
      }

      return { category, imageUploadFailed };
    } catch {
      setError("No se pudo crear la categoría.");
      return { category: null, imageUploadFailed: false };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    error,
    successMessage,
    createdCategory,
    createCategoryWithOptionalImages,
  };
}
