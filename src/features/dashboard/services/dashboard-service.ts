import { apiClient } from "@/src/services/api-client";
import type { DashboardStatsResponse } from "@/src/features/dashboard/types/dashboard";

export const dashboardService = {
  getStats() {
    return apiClient.request<DashboardStatsResponse>("/admin/dashboard/stats");
  },
  exportCsv() {
    return apiClient.requestBlob("/admin/dashboard/stats/export/csv");
  },
};
