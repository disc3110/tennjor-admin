import type { Product } from "@/src/features/products/types/product";
import { apiClient } from "@/src/services/api-client";

export const productsService = {
  list() {
    return apiClient.request<Product[]>("/admin/products");
  },
};
