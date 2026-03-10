import type {
  ConvertQuoteRequestToSalesQuoteResponse,
  GetAdminQuoteRequestByIdResponse,
  AdminQuoteRequestsResponse,
  GetAdminQuoteRequestsQuery,
  UpdateAdminQuoteRequestStatusPayload,
  UpdateAdminQuoteRequestStatusResponse,
} from "@/src/features/quotes/types/quote";
import { apiClient } from "@/src/services/api-client";

function toQueryString(query: GetAdminQuoteRequestsQuery) {
  const params = new URLSearchParams();

  if (query.status) params.set("status", query.status);
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  const parsed = params.toString();
  return parsed ? `?${parsed}` : "";
}

export const quotesService = {
  list(query: GetAdminQuoteRequestsQuery = {}) {
    return apiClient.request<AdminQuoteRequestsResponse>(
      `/admin/quote-requests${toQueryString(query)}`,
    );
  },
  getById(id: string) {
    return apiClient.request<GetAdminQuoteRequestByIdResponse>(`/admin/quote-requests/${id}`);
  },
  updateStatus(id: string, payload: UpdateAdminQuoteRequestStatusPayload) {
    return apiClient.request<UpdateAdminQuoteRequestStatusResponse, UpdateAdminQuoteRequestStatusPayload>(
      `/admin/quote-requests/${id}/status`,
      {
        method: "PATCH",
        body: payload,
      },
    );
  },
  convertToSalesQuote(id: string) {
    return apiClient.request<ConvertQuoteRequestToSalesQuoteResponse>(
      `/admin/quote-requests/${id}/convert-to-sales-quote`,
      {
        method: "POST",
      },
    );
  },
};
