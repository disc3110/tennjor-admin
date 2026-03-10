import { SalesQuoteDetailView } from "@/src/features/sales-quotes/components/sales-quote-detail-view";

type AdminSalesQuoteDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminSalesQuoteDetailPage({
  params,
}: AdminSalesQuoteDetailPageProps) {
  const { id } = await params;
  return <SalesQuoteDetailView quoteId={id} />;
}
