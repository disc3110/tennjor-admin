import type {
  AdminCategoriesListResponse,
  BulkCreateVariantsPayload,
  BulkCreateVariantsResponse,
  DeleteProductImageResponse,
  DeleteProductResponse,
  DeleteVariantResponse,
  CreateProductVariantPayload,
  CreateAdminProductPayload,
  CreateAdminProductResponse,
  ProductAdminDetailResponse,
  ProductAdminListQuery,
  ProductAdminListResponse,
  ProductVariantResponse,
  UploadProductImagePayload,
  UploadProductImageResponse,
  UpdateProductVariantPayload,
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
  getById(id: string) {
    return apiClient.request<ProductAdminDetailResponse>(`/admin/products/${id}`);
  },
  listCategories() {
    return apiClient.request<AdminCategoriesListResponse>("/admin/categories");
  },
  create(payload: CreateAdminProductPayload) {
    return apiClient.request<CreateAdminProductResponse, CreateAdminProductPayload>(
      "/admin/products",
      {
        method: "POST",
        body: payload,
      },
    );
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
  createVariant(productId: string, payload: CreateProductVariantPayload) {
    return apiClient.request<ProductVariantResponse, CreateProductVariantPayload>(
      `/admin/products/${productId}/variants`,
      {
        method: "POST",
        body: payload,
      },
    );
  },
  updateVariant(variantId: string, payload: UpdateProductVariantPayload) {
    return apiClient.request<ProductVariantResponse, UpdateProductVariantPayload>(
      `/admin/variants/${variantId}`,
      {
        method: "PATCH",
        body: payload,
      },
    );
  },
  deleteVariant(variantId: string) {
    return apiClient.request<DeleteVariantResponse>(`/admin/variants/${variantId}`, {
      method: "DELETE",
    });
  },
  bulkCreateVariants(productId: string, payload: BulkCreateVariantsPayload) {
    return apiClient.request<BulkCreateVariantsResponse, BulkCreateVariantsPayload>(
      `/admin/products/${productId}/variants/bulk`,
      {
        method: "POST",
        body: payload,
      },
    );
  },
  uploadProductImage(productId: string, payload: UploadProductImagePayload) {
    const formData = new FormData();
    formData.append("file", payload.file);
    if (payload.alt) formData.append("alt", payload.alt);
    if (typeof payload.order === "number") formData.append("order", String(payload.order));

    return apiClient.request<UploadProductImageResponse, FormData>(
      `/admin/products/${productId}/images/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
  },
  deleteProductImage(imageId: string) {
    return apiClient.request<DeleteProductImageResponse>(`/admin/product-images/${imageId}`, {
      method: "DELETE",
    });
  },
  deleteProduct(productId: string) {
    return apiClient.request<DeleteProductResponse>(`/admin/products/${productId}`, {
      method: "DELETE",
    });
  },
};
