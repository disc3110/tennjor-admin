import type {
  AdminQuoteRequestsResponse,
  GetAdminQuoteRequestsQuery,
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
};
