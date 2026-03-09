export type DashboardStatsResponse = {
  data: {
    summary: {
      totalQuotes: number;
      newQuotes: number;
      quotesThisWeek: number;
    };
    quotesByStatus: Record<string, number>;
    topRequestedProducts: Array<{
      productId: string;
      productName: string;
      productSlug: string;
      totalRequestedQuantity: number;
      totalQuoteLines: number;
    }>;
  };
};
