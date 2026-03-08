import type {
  ProductAdminListQuery,
  ProductAdminListResponse,
  UpdateAdminProductPayload,
  UpdateAdminProductResponse,
} from "@/src/features/products/types/product";
import { apiClient } from "@/src/services/api-client";

function toQueryString(query: ProductAdminListQuery) {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.categoryId) params.set("categoryId", query.categoryId);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (typeof query.isActive === "boolean") {
    params.set("isActive", String(query.isActive));
  }

  const parsed = params.toString();
  return parsed ? `?${parsed}` : "";
}

export const productsService = {
  list(query: ProductAdminListQuery = {}) {
    return apiClient.request<ProductAdminListResponse>(`/admin/products${toQueryString(query)}`);
  },
  update(id: string, payload: UpdateAdminProductPayload) {
    return apiClient.request<UpdateAdminProductResponse, UpdateAdminProductPayload>(
      `/admin/products/${id}`,
      {
        method: "PATCH",
        body: payload,
      },
    );
  },
};
