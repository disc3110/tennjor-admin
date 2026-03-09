import { apiClient } from "@/src/services/api-client";

export const dashboardService = {
  exportCsv() {
    return apiClient.requestBlob("/admin/dashboard/stats/export/csv");
  },
};
