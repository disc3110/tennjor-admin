"use client";

import { useCallback, useState } from "react";
import { extractFilenameFromDisposition, downloadBlobFile } from "@/src/lib/csv-download";
import { salesService } from "@/src/features/sales/services/sales-service";
import type { GetCompletedSalesQuery } from "@/src/features/sales/types/sale";

type UseSalesExportResult = {
  isExporting: boolean;
  exportError: string | null;
  exportCsv: (query: Omit<GetCompletedSalesQuery, "page" | "limit">) => Promise<void>;
};

export function useSalesExport(): UseSalesExportResult {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportCsv = useCallback(async (query: Omit<GetCompletedSalesQuery, "page" | "limit">) => {
    setIsExporting(true);
    setExportError(null);

    try {
      const response = await salesService.exportCsv(query);
      const filename = extractFilenameFromDisposition(
        response.headers.get("content-disposition"),
        "sales.csv",
      );
      downloadBlobFile(response.blob, filename);
    } catch {
      setExportError("No se pudo exportar el CSV de ventas en este momento.");
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
