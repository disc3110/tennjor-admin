"use client";

import { useCallback, useEffect, useState } from "react";
import { productsService } from "@/src/features/products/services/products-service";
import type {
  CategoryAdmin,
  ProductAdminDetail,
  UploadProductImagePayload,
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
  uploadProductImage: (payload: UploadProductImagePayload) => Promise<void>;
  updateProductImage: (imageId: string, payload: { alt?: string; order?: number }) => Promise<void>;
  deleteProductImage: (imageId: string) => Promise<void>;
  deleteProduct: () => Promise<void>;
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

  const uploadProductImage = useCallback(
    async (payload: UploadProductImagePayload) => {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        await productsService.uploadProductImage(productId, payload);
        await fetchData();
        setSuccessMessage("Image uploaded successfully.");
      } catch {
        setError("Unable to upload product image.");
      } finally {
        setIsSaving(false);
      }
    },
    [fetchData, productId],
  );

  const deleteProductImage = useCallback(
    async (imageId: string) => {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const response = await productsService.deleteProductImage(imageId);
        setProduct((current) =>
          current
            ? {
                ...current,
                images: current.images.filter((image) => image.id !== imageId),
              }
            : current,
        );
        if (response.data.cloudinaryCleanup.error) {
          setSuccessMessage(
            `Image deleted. Cloudinary cleanup warning: ${response.data.cloudinaryCleanup.error}`,
          );
        } else {
          setSuccessMessage("Image deleted successfully.");
        }
      } catch {
        setError("Unable to delete product image.");
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const updateProductImage = useCallback(
    async (imageId: string, payload: { alt?: string; order?: number }) => {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const response = await productsService.updateProductImage(imageId, payload);
        setProduct((current) =>
          current
            ? {
                ...current,
                images: current.images.map((image) =>
                  image.id === imageId ? response.data : image,
                ),
              }
            : current,
        );
        setSuccessMessage("Image metadata updated successfully.");
      } catch {
        setError("Unable to update image metadata.");
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const deleteProduct = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await productsService.deleteProduct(productId);
      if (response.data.cloudinaryCleanupPendingPublicIds.length > 0) {
        setSuccessMessage(
          `Product deleted. Pending cloud cleanup: ${response.data.cloudinaryCleanupPendingPublicIds.length} image(s).`,
        );
      } else {
        setSuccessMessage("Product deleted successfully.");
      }
    } catch {
      setError("Unable to delete product. It may be referenced by quote requests.");
      throw new Error("delete_failed");
    } finally {
      setIsSaving(false);
    }
  }, [productId]);

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
    uploadProductImage,
    updateProductImage,
    deleteProductImage,
    deleteProduct,
    refetch: fetchData,
  };
}
