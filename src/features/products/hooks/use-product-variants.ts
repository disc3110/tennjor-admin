"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { productsService } from "@/src/features/products/services/products-service";
import type {
  BulkCreateVariantsPayload,
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
  deleteVariant: (variantId: string) => Promise<void>;
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
      setError("No se pudieron cargar las variantes.");
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
        setSuccessMessage("Variante creada correctamente.");
      } catch {
        setError("No se pudo crear la variante.");
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
        setSuccessMessage("Variante actualizada correctamente.");
      } catch {
        setError("No se pudo actualizar la variante.");
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
        setError("Rango de tallas inválido.");
        return;
      }

      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const payload: BulkCreateVariantsPayload = {
          startSize: input.startSize,
          endSize: input.endSize,
          includeHalfSizes: input.includeHalfSizes,
          color: input.color,
          stock: input.stock,
          isActive: input.isActive,
        };
        const response = await productsService.bulkCreateVariants(productId, payload);

        await loadProduct();
        setSuccessMessage(
          `${response.data.createdCount} creadas, ${response.data.skippedCount} omitidas (${response.data.skippedSizes.join(", ") || "ninguna"}).`,
        );
      } catch {
        setError("Falló la creación de variantes por rango.");
      } finally {
        setIsSaving(false);
      }
    },
    [loadProduct, productId],
  );

  const deleteVariant = useCallback(
    async (variantId: string) => {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        await productsService.deleteVariant(variantId);
        setProduct((current) =>
          current
            ? {
                ...current,
                variants: current.variants.filter((variant) => variant.id !== variantId),
              }
            : current,
        );
        setSuccessMessage("Variante eliminada correctamente.");
      } catch {
        setError("No se pudo eliminar la variante.");
      } finally {
        setIsSaving(false);
      }
    },
    [],
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
    deleteVariant,
  };
}
