"use client";

import { useCallback, useState } from "react";
import { extractFilenameFromDisposition, downloadBlobFile } from "@/src/lib/csv-download";
import { productsService } from "@/src/features/products/services/products-service";

type ProductsExportQuery = {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
};

type UseProductsExportResult = {
  isExporting: boolean;
  exportError: string | null;
  exportCsv: (query: ProductsExportQuery) => Promise<void>;
};

export function useProductsExport(): UseProductsExportResult {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportCsv = useCallback(async (query: ProductsExportQuery) => {
    setIsExporting(true);
    setExportError(null);

    try {
      const response = await productsService.exportCsv(query);
      const filename = extractFilenameFromDisposition(
        response.headers.get("content-disposition"),
        "products.csv",
      );

      downloadBlobFile(response.blob, filename);
    } catch {
      setExportError("Unable to export products CSV right now.");
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
