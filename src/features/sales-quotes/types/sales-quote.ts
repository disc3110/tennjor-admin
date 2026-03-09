export type InternalSaleQuoteStatus =
  | "DRAFT"
  | "SENT"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED"
  | "COMPLETED";

export type InternalDiscountType = "FIXED" | "PERCENTAGE";

export type MonetaryValue = string | number;

export type InternalQuoteTotals = {
  subtotal: MonetaryValue;
  discountTotal: MonetaryValue;
  totalRevenue: MonetaryValue;
  totalCost: MonetaryValue;
  totalProfit: MonetaryValue;
  marginPct: MonetaryValue;
};

export type InternalSaleQuoteSummary = InternalQuoteTotals & {
  id: string;
  code: string;
  status: InternalSaleQuoteStatus;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  customerCity: string | null;
  notes: string | null;
  currency: string;
  publicQuoteRequestId: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InternalSaleQuoteItem = {
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
  discountType: InternalDiscountType | null;
  discountValue: MonetaryValue | null;
  sortOrder: number;
  lineRevenue: MonetaryValue;
  lineCost: MonetaryValue;
  lineProfit: MonetaryValue;
  createdAt: string;
  updatedAt?: string;
};

export type InternalQuoteLinkedPublicRequest = {
  id: string;
  customerName: string;
  status: string;
  createdAt: string;
};

export type InternalQuoteCreatedBy = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type InternalSaleQuoteDetail = InternalSaleQuoteSummary & {
  items: InternalSaleQuoteItem[];
  publicQuoteRequest?: InternalQuoteLinkedPublicRequest | null;
  createdBy?: InternalQuoteCreatedBy | null;
};

export type InternalSaleQuotesMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type GetInternalSaleQuotesQuery = {
  status?: InternalSaleQuoteStatus;
  search?: string;
  page?: number;
  limit?: number;
};

export type GetInternalSaleQuotesResponse = {
  data: InternalSaleQuoteSummary[];
  meta: InternalSaleQuotesMeta;
};

export type GetInternalSaleQuoteByIdResponse = {
  data: InternalSaleQuoteDetail;
};

export type CreateInternalSaleQuotePayload = {
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerCity?: string;
  notes?: string;
  currency?: string;
  publicQuoteRequestId?: string;
};

export type CreateInternalSaleQuoteResponse = {
  message: string;
  data: InternalSaleQuoteSummary;
};

export type UpdateInternalSaleQuotePayload = {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerCity?: string;
  notes?: string;
  currency?: string;
  discountTotal?: number;
};

export type UpdateInternalSaleQuoteResponse = {
  data: InternalSaleQuoteDetail;
};

export type CreateInternalSaleQuoteItemPayload = {
  productId: string;
  variantId?: string;
  quantity: number;
  unitSalePrice: number;
  unitCostSnapshot?: number;
  discountType?: InternalDiscountType;
  discountValue?: number;
  sortOrder?: number;
};

export type UpdateInternalSaleQuoteItemPayload = {
  quantity?: number;
  unitSalePrice?: number;
  unitCostSnapshot?: number;
  discountType?: InternalDiscountType;
  discountValue?: number;
  sortOrder?: number;
};

export type CreateInternalSaleQuoteItemResponse = {
  message: string;
  data: {
    item: InternalSaleQuoteItem;
    quoteTotals: InternalQuoteTotals;
  };
};

export type UpdateInternalSaleQuoteItemResponse = {
  message: string;
  data: {
    item: InternalSaleQuoteItem;
    quoteTotals: InternalQuoteTotals;
  };
};

export type DeleteInternalSaleQuoteItemResponse = {
  message: string;
  data: {
    id: string;
    quoteTotals: InternalQuoteTotals;
  };
};

export type RecalculateInternalSaleQuoteResponse = {
  message: string;
  data: InternalQuoteTotals;
};

export type CompleteInternalSaleQuoteResponse = {
  message: string;
  data: {
    sale: {
      id: string;
      saleNumber: string;
      status: string;
      subtotal: MonetaryValue;
      discountTotal: MonetaryValue;
      totalRevenue: MonetaryValue;
      totalCost: MonetaryValue;
      totalProfit: MonetaryValue;
      marginPct: MonetaryValue;
      completedAt: string;
      createdAt: string;
    };
    quote: {
      id: string;
      code: string;
      status: InternalSaleQuoteStatus;
      completedAt: string;
      updatedAt: string;
    };
  };
};

export type ProductOptionForInternalQuote = {
  id: string;
  name: string;
  slug: string;
  baseCost?: MonetaryValue | null;
  variants: Array<{
    id: string;
    size: string;
    color: string;
    sku: string | null;
    isActive: boolean;
    stock: number;
  }>;
};
