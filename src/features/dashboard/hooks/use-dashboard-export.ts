"use client";

import { useCallback, useState } from "react";
import { dashboardService } from "@/src/features/dashboard/services/dashboard-service";
import { extractFilenameFromDisposition, downloadBlobFile } from "@/src/lib/csv-download";

type UseDashboardExportResult = {
  isExporting: boolean;
  exportError: string | null;
  exportCsv: () => Promise<void>;
};

export function useDashboardExport(): UseDashboardExportResult {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportCsv = useCallback(async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      const response = await dashboardService.exportCsv();
      const filename = extractFilenameFromDisposition(
        response.headers.get("content-disposition"),
        "dashboard-stats.csv",
      );

      downloadBlobFile(response.blob, filename);
    } catch {
      setExportError("No se pudo exportar el CSV del panel en este momento.");
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    isExporting,
    exportError,
    exportCsv,
  };
}
