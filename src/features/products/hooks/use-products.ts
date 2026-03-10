"use client";

import { useCallback, useEffect, useState } from "react";
import { productsService } from "@/src/features/products/services/products-service";
import type {
  ProductAdmin,
  ProductAdminListMeta,
  ProductAdminListQuery,
} from "@/src/features/products/types/product";

type UseProductsResult = {
  products: ProductAdmin[];
  meta: ProductAdminListMeta | null;
  isLoading: boolean;
  isUpdating: string | null;
  error: string | null;
  refetch: () => Promise<void>;
  toggleProductActive: (product: ProductAdmin) => Promise<void>;
};

export function useProducts(query: ProductAdminListQuery = {}): UseProductsResult {
  const { search, categoryId, page, limit, isActive } = query;
  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [meta, setMeta] = useState<ProductAdminListMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await productsService.list({
        search,
        categoryId,
        page,
        limit,
      });

      // Backend contract supports `isActive`, but runtime behavior for `false`
      // can be inconsistent. Apply deterministic client filtering on real fields.
      const filteredData =
        typeof isActive === "boolean"
          ? response.data.filter((product) => product.isActive === isActive)
          : response.data;

      setProducts(filteredData);
      setMeta(response.meta);
    } catch {
      setError("No se pudieron cargar los productos en este momento.");
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, isActive, limit, page, search]);

  const toggleProductActive = useCallback(
    async (product: ProductAdmin) => {
      setIsUpdating(product.id);
      setError(null);

      try {
        const response = await productsService.update(product.id, {
          isActive: !product.isActive,
        });

        setProducts((previous) =>
          previous.map((item) => (item.id === product.id ? response.data : item)),
        );
      } catch {
        setError("No se pudo actualizar el estado del producto.");
      } finally {
        setIsUpdating(null);
      }
    },
    [],
  );

  useEffect(() => {
    fetchProducts().catch(() => {
      // Request errors are handled in fetchProducts state.
    });
  }, [fetchProducts]);

  return {
    products,
    meta,
    isLoading,
    isUpdating,
    error,
    refetch: fetchProducts,
    toggleProductActive,
  };
}
