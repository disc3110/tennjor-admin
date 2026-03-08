"use client";

import { useCallback, useEffect, useState } from "react";
import { productsService } from "@/src/features/products/services/products-service";
import type {
  CategoryAdmin,
  CreateAdminProductPayload,
  ProductAdminDetail,
  UploadProductImagePayload,
} from "@/src/features/products/types/product";

type InitialImageInput = {
  file: File;
  alt?: string;
  order?: number;
};

type UseProductCreateResult = {
  categories: CategoryAdmin[];
  createdProduct: ProductAdminDetail | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  successMessage: string | null;
  createProductWithOptionalImage: (
    payload: CreateAdminProductPayload,
    initialImage?: InitialImageInput,
  ) => Promise<{ product: ProductAdminDetail | null; imageUploadFailed: boolean }>;
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

  const createProductWithOptionalImage = useCallback(
    async (payload: CreateAdminProductPayload, initialImage?: InitialImageInput) => {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const createResponse = await productsService.create(payload);
        const product = createResponse.data;
        setCreatedProduct(product);

        let imageUploadFailed = false;
        if (initialImage) {
          const uploadPayload: UploadProductImagePayload = {
            file: initialImage.file,
            alt: initialImage.alt,
            order: initialImage.order,
          };

          try {
            await productsService.uploadProductImage(product.id, uploadPayload);
            setSuccessMessage("Product and initial image created successfully.");
          } catch {
            imageUploadFailed = true;
            setSuccessMessage(
              "Product created successfully, but initial image upload failed. You can retry on the edit page.",
            );
          }
        } else {
          setSuccessMessage(createResponse.message);
        }

        return { product, imageUploadFailed };
      } catch {
        setError("Unable to create product.");
        return { product: null, imageUploadFailed: false };
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

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
    createProductWithOptionalImage,
    refetch: fetchCategories,
  };
}
