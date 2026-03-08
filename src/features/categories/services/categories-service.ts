import type { Category } from "@/src/features/categories/types/category";
import { apiClient } from "@/src/services/api-client";

export const categoriesService = {
  list() {
    return apiClient.request<Category[]>("/admin/categories");
  },
};
