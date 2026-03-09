import type { InternalQuoteTotals, MonetaryValue } from "@/src/features/sales-quotes/types/sales-quote";

export type CompletedSaleStatus = "COMPLETED" | "CANCELLED" | "REFUNDED";

export type CompletedSaleSummary = {
  id: string;
  saleNumber: string;
  status: CompletedSaleStatus;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  currency: string;
  totalRevenue: MonetaryValue;
  totalCost: MonetaryValue;
  totalProfit: MonetaryValue;
  marginPct: MonetaryValue;
  completedAt: string;
  createdAt: string;
  quoteId: string | null;
};

export type CompletedSalesMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type GetCompletedSalesQuery = {
  page?: number;
  limit?: number;
  status?: CompletedSaleStatus;
  customerName?: string;
  saleNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "completedAt" | "createdAt" | "totalRevenue" | "totalProfit";
  sortOrder?: "asc" | "desc";
};

export type GetCompletedSalesResponse = {
  data: CompletedSaleSummary[];
  meta: CompletedSalesMeta;
};

export type CompletedSaleItem = {
  id: string;
  productId: string;
  variantId: string | null;
  productNameSnapshot: string;
  productSlugSnapshot: string;
  sizeSnapshot: string | null;
  colorSnapshot: string | null;
  skuSnapshot: string | null;
  quantity: number;
  unitSalePrice: MonetaryValue;
  unitCostSnapshot: MonetaryValue;
  lineRevenue: MonetaryValue;
  lineCost: MonetaryValue;
  lineProfit: MonetaryValue;
  discountType: "FIXED" | "PERCENTAGE" | null;
  discountValue: MonetaryValue | null;
  createdAt: string;
};

export type CompletedSaleDetail = InternalQuoteTotals & {
  id: string;
  saleNumber: string;
  status: CompletedSaleStatus;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  customerCity: string | null;
  currency: string;
  notes: string | null;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
  quote?: {
    id: string;
    code: string;
    status: string;
    createdAt: string;
  } | null;
  createdBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  items: CompletedSaleItem[];
};

export type GetCompletedSaleByIdResponse = {
  data: CompletedSaleDetail;
};

export type SalesStatsPeriod = "month" | "year" | "custom";

export type GetSalesStatsQuery = {
  period?: SalesStatsPeriod;
  year?: number;
  month?: number;
  dateFrom?: string;
  dateTo?: string;
  status?: CompletedSaleStatus;
};

export type SalesStatsTopProduct = {
  productId: string;
  productName: string;
  productSlug: string;
  totalQuantity: number;
  totalRevenue: number;
  totalProfit: number;
};

export type SalesStatsData = {
  period: SalesStatsPeriod;
  dateFrom: string;
  dateTo: string;
  salesCount: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  averageMarginPct: number;
  averageTicket: number;
  salesByStatus: Partial<Record<CompletedSaleStatus, number>>;
  topSellingProducts: SalesStatsTopProduct[];
  topProfitableProducts: SalesStatsTopProduct[];
};

export type GetSalesStatsResponse = {
  data: SalesStatsData;
};
