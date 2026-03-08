export type QuoteRequestStatus = "NEW" | "CONTACTED" | "QUOTED" | "CLOSED" | "REJECTED";

export type QuoteRequestSource = "WEB_FORM" | "WHATSAPP";

export type AdminQuoteRequestItem = {
  id: string;
  productId: string;
  productNameSnapshot: string;
  productSlugSnapshot: string;
  size: string;
  color: string;
  quantity: number;
};

export type AdminQuoteRequest = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCity: string;
  notes: string;
  internalNotes: string[];
  status: QuoteRequestStatus;
  source: QuoteRequestSource;
  createdAt: string;
  updatedAt: string;
  items: AdminQuoteRequestItem[];
};

export type AdminQuoteRequestsMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AdminQuoteRequestsResponse = {
  data: AdminQuoteRequest[];
  meta: AdminQuoteRequestsMeta;
};

export type GetAdminQuoteRequestsQuery = {
  status?: QuoteRequestStatus;
  search?: string;
  page?: number;
  limit?: number;
};
