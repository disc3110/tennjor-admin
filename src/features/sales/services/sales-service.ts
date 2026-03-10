import type {
  GetCompletedSaleByIdResponse,
  GetCompletedSalesQuery,
  GetCompletedSalesResponse,
  GetSalesStatsQuery,
  GetSalesStatsResponse,
} from "@/src/features/sales/types/sale";
import { apiClient } from "@/src/services/api-client";

function toQueryString(query: GetCompletedSalesQuery) {
  const params = new URLSearchParams();

  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.status) params.set("status", query.status);
  if (query.customerName) params.set("customerName", query.customerName);
  if (query.saleNumber) params.set("saleNumber", query.saleNumber);
  if (query.dateFrom) params.set("dateFrom", query.dateFrom);
  if (query.dateTo) params.set("dateTo", query.dateTo);
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortOrder) params.set("sortOrder", query.sortOrder);

  const parsed = params.toString();
  return parsed ? `?${parsed}` : "";
}

function toStatsQueryString(query: GetSalesStatsQuery) {
  const params = new URLSearchParams();

  if (query.period) params.set("period", query.period);
  if (query.year) params.set("year", String(query.year));
  if (query.month) params.set("month", String(query.month));
  if (query.dateFrom) params.set("dateFrom", query.dateFrom);
  if (query.dateTo) params.set("dateTo", query.dateTo);
  if (query.status) params.set("status", query.status);

  const parsed = params.toString();
  return parsed ? `?${parsed}` : "";
}

export const salesService = {
  list(query: GetCompletedSalesQuery = {}) {
    return apiClient.request<GetCompletedSalesResponse>(`/admin/sales${toQueryString(query)}`);
  },
  getById(id: string) {
    return apiClient.request<GetCompletedSaleByIdResponse>(`/admin/sales/${id}`);
  },
  getStats(query: GetSalesStatsQuery = {}) {
    return apiClient.request<GetSalesStatsResponse>(`/admin/sales/stats${toStatsQueryString(query)}`);
  },
  exportCsv(query: Omit<GetCompletedSalesQuery, "page" | "limit"> = {}) {
    return apiClient.requestBlob(`/admin/sales/export/csv${toQueryString(query)}`);
  },
};
