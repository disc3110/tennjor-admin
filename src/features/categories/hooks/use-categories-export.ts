"use client";

import { useCallback, useState } from "react";
import { categoriesService } from "@/src/features/categories/services/categories-service";
import { extractFilenameFromDisposition, downloadBlobFile } from "@/src/lib/csv-download";

type CategoriesExportQuery = {
  search?: string;
  isActive?: boolean;
};

type UseCategoriesExportResult = {
  isExporting: boolean;
  exportError: string | null;
  exportCsv: (query: CategoriesExportQuery) => Promise<void>;
};

export function useCategoriesExport(): UseCategoriesExportResult {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportCsv = useCallback(async (query: CategoriesExportQuery) => {
    setIsExporting(true);
    setExportError(null);

    try {
      const response = await categoriesService.exportCsv(query);
      const filename = extractFilenameFromDisposition(
        response.headers.get("content-disposition"),
        "categories.csv",
      );

      downloadBlobFile(response.blob, filename);
    } catch {
      setExportError("No se pudo exportar el CSV de categorías en este momento.");
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
