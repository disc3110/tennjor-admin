import type { ProductAdminDetailResponse, ProductAdminListResponse } from "@/src/features/products/types/product";
import type {
  CompleteInternalSaleQuoteResponse,
  CreateInternalSaleQuoteItemPayload,
  CreateInternalSaleQuoteItemResponse,
  CreateInternalSaleQuoteNotePayload,
  CreateInternalSaleQuoteNoteResponse,
  CreateInternalSaleQuotePayload,
  CreateInternalSaleQuoteResponse,
  DeleteInternalSaleQuoteItemResponse,
  GetInternalSaleQuoteByIdResponse,
  GetInternalSaleQuotesQuery,
  GetInternalSaleQuotesResponse,
  RecalculateInternalSaleQuoteResponse,
  UpdateInternalSaleQuoteItemPayload,
  UpdateInternalSaleQuoteItemResponse,
  UpdateInternalSaleQuotePayload,
  UpdateInternalSaleQuoteResponse,
} from "@/src/features/sales-quotes/types/sales-quote";
import { apiClient } from "@/src/services/api-client";

function toQueryString(query: GetInternalSaleQuotesQuery) {
  const params = new URLSearchParams();

  if (query.status) params.set("status", query.status);
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  const parsed = params.toString();
  return parsed ? `?${parsed}` : "";
}

export const salesQuotesService = {
  list(query: GetInternalSaleQuotesQuery = {}) {
    return apiClient.request<GetInternalSaleQuotesResponse>(
      `/admin/sales-quotes${toQueryString(query)}`,
    );
  },
  getById(id: string) {
    return apiClient.request<GetInternalSaleQuoteByIdResponse>(`/admin/sales-quotes/${id}`);
  },
  create(payload: CreateInternalSaleQuotePayload) {
    return apiClient.request<CreateInternalSaleQuoteResponse, CreateInternalSaleQuotePayload>(
      "/admin/sales-quotes",
      {
        method: "POST",
        body: payload,
      },
    );
  },
  update(id: string, payload: UpdateInternalSaleQuotePayload) {
    return apiClient.request<UpdateInternalSaleQuoteResponse, UpdateInternalSaleQuotePayload>(
      `/admin/sales-quotes/${id}`,
      {
        method: "PATCH",
        body: payload,
      },
    );
  },
  addItem(quoteId: string, payload: CreateInternalSaleQuoteItemPayload) {
    return apiClient.request<CreateInternalSaleQuoteItemResponse, CreateInternalSaleQuoteItemPayload>(
      `/admin/sales-quotes/${quoteId}/items`,
      {
        method: "POST",
        body: payload,
      },
    );
  },
  updateItem(quoteId: string, itemId: string, payload: UpdateInternalSaleQuoteItemPayload) {
    return apiClient.request<UpdateInternalSaleQuoteItemResponse, UpdateInternalSaleQuoteItemPayload>(
      `/admin/sales-quotes/${quoteId}/items/${itemId}`,
      {
        method: "PATCH",
        body: payload,
      },
    );
  },
  deleteItem(quoteId: string, itemId: string) {
    return apiClient.request<DeleteInternalSaleQuoteItemResponse>(
      `/admin/sales-quotes/${quoteId}/items/${itemId}`,
      {
        method: "DELETE",
      },
    );
  },
  recalculate(quoteId: string) {
    return apiClient.request<RecalculateInternalSaleQuoteResponse>(
      `/admin/sales-quotes/${quoteId}/recalculate`,
      {
        method: "POST",
      },
    );
  },
  addInternalNote(quoteId: string, payload: CreateInternalSaleQuoteNotePayload) {
    return apiClient.request<CreateInternalSaleQuoteNoteResponse, CreateInternalSaleQuoteNotePayload>(
      `/admin/sales-quotes/${quoteId}/internal-notes`,
      {
        method: "POST",
        body: payload,
      },
    );
  },
  completeSale(quoteId: string) {
    return apiClient.request<CompleteInternalSaleQuoteResponse>(
      `/admin/sales-quotes/${quoteId}/complete-sale`,
      {
        method: "POST",
      },
    );
  },
  listProductOptions() {
    return apiClient.request<ProductAdminListResponse>("/admin/products?page=1&limit=100");
  },
  getProductOptionById(productId: string) {
    return apiClient.request<ProductAdminDetailResponse>(`/admin/products/${productId}`);
  },
};
