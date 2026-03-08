"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { productsService } from "@/src/features/products/services/products-service";
import type {
  CreateProductVariantPayload,
  ProductAdminDetail,
  ProductAdminVariant,
  UpdateProductVariantPayload,
} from "@/src/features/products/types/product";
import { generateSizeRange } from "@/src/features/products/utils/size-range";

type BulkCreateInput = {
  startSize: number;
  endSize: number;
  includeHalfSizes: boolean;
  color: string;
  stock: number;
  isActive: boolean;
};

type UseProductVariantsResult = {
  product: ProductAdminDetail | null;
  variants: ProductAdminVariant[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  successMessage: string | null;
  sizePreview: string[];
  loadProduct: () => Promise<void>;
  createVariant: (payload: CreateProductVariantPayload) => Promise<void>;
  updateVariant: (variantId: string, payload: UpdateProductVariantPayload) => Promise<void>;
  toggleVariantActive: (variant: ProductAdminVariant) => Promise<void>;
  previewBulkSizes: (input: BulkCreateInput) => string[];
  createVariantsFromRange: (input: BulkCreateInput) => Promise<void>;
};

export function useProductVariants(productId: string): UseProductVariantsResult {
  const [product, setProduct] = useState<ProductAdminDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [sizePreview, setSizePreview] = useState<string[]>([]);

  const variants = useMemo(() => product?.variants ?? [], [product]);

  const loadProduct = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await productsService.getById(productId);
      setProduct(response.data);
    } catch {
      setError("Unable to load variants.");
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  const createVariant = useCallback(
    async (payload: CreateProductVariantPayload) => {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        await productsService.createVariant(productId, payload);
        await loadProduct();
        setSuccessMessage("Variant created successfully.");
      } catch {
        setError("Unable to create variant.");
      } finally {
        setIsSaving(false);
      }
    },
    [loadProduct, productId],
  );

  const updateVariant = useCallback(
    async (variantId: string, payload: UpdateProductVariantPayload) => {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const response = await productsService.updateVariant(variantId, payload);
        setProduct((current) =>
          current
            ? {
                ...current,
                variants: current.variants.map((variant) =>
                  variant.id === variantId ? response.data : variant,
                ),
              }
            : current,
        );
        setSuccessMessage("Variant updated successfully.");
      } catch {
        setError("Unable to update variant.");
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const toggleVariantActive = useCallback(
    async (variant: ProductAdminVariant) => {
      await updateVariant(variant.id, { isActive: !variant.isActive });
    },
    [updateVariant],
  );

  const previewBulkSizes = useCallback((input: BulkCreateInput) => {
    const generated = generateSizeRange(input);
    setSizePreview(generated);
    return generated;
  }, []);

  const createVariantsFromRange = useCallback(
    async (input: BulkCreateInput) => {
      const sizes = generateSizeRange(input);
      setSizePreview(sizes);

      if (sizes.length === 0) {
        setError("Invalid size range.");
        return;
      }

      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        // Bulk endpoint is not documented; fallback to documented single-create endpoint.
        for (const size of sizes) {
          await productsService.createVariant(productId, {
            size,
            color: input.color,
            stock: input.stock,
            isActive: input.isActive,
          });
        }

        await loadProduct();
        setSuccessMessage(`${sizes.length} variant(s) created successfully.`);
      } catch {
        setError("Failed during range variant creation.");
      } finally {
        setIsSaving(false);
      }
    },
    [loadProduct, productId],
  );

  useEffect(() => {
    loadProduct().catch(() => {
      // Request errors are handled in hook state.
    });
  }, [loadProduct]);

  return {
    product,
    variants,
    isLoading,
    isSaving,
    error,
    successMessage,
    sizePreview,
    loadProduct,
    createVariant,
    updateVariant,
    toggleVariantActive,
    previewBulkSizes,
    createVariantsFromRange,
  };
}
