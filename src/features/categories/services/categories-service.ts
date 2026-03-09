import type {
  AdminCategoriesListResponse,
  CategoryDetailResponse,
  CategoryListQuery,
  CategoryImageUploadResponse,
  CreateCategoryPayload,
  CreateCategoryResponse,
  DeleteCategoryResponse,
  UpdateCategoryPayload,
  UpdateCategoryResponse,
} from "@/src/features/categories/types/category";
import { apiClient } from "@/src/services/api-client";

function toQueryString(query: CategoryListQuery) {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (typeof query.isActive === "boolean") {
    params.set("isActive", String(query.isActive));
  }

  const parsed = params.toString();
  return parsed ? `?${parsed}` : "";
}

export const categoriesService = {
  list(query: CategoryListQuery = {}) {
    return apiClient.request<AdminCategoriesListResponse>(
      `/admin/categories${toQueryString(query)}`,
    );
  },
  getById(id: string) {
    return apiClient.request<CategoryDetailResponse>(`/admin/categories/${id}`);
  },
  create(payload: CreateCategoryPayload) {
    return apiClient.request<CreateCategoryResponse, CreateCategoryPayload>("/admin/categories", {
      method: "POST",
      body: payload,
    });
  },
  update(id: string, payload: UpdateCategoryPayload) {
    return apiClient.request<UpdateCategoryResponse, UpdateCategoryPayload>(
      `/admin/categories/${id}`,
      {
        method: "PATCH",
        body: payload,
      },
    );
  },
  delete(id: string) {
    return apiClient.request<DeleteCategoryResponse>(`/admin/categories/${id}`, {
      method: "DELETE",
    });
  },
  uploadWebImage(id: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.request<CategoryImageUploadResponse, FormData>(
      `/admin/categories/${id}/images/web/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
  },
  uploadMobileImage(id: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.request<CategoryImageUploadResponse, FormData>(
      `/admin/categories/${id}/images/mobile/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
  },
};
