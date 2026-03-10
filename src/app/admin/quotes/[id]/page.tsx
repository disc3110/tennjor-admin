import { QuoteDetailView } from "@/src/features/quotes/components/quote-detail-view";

type AdminQuoteDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminQuoteDetailPage({ params }: AdminQuoteDetailPageProps) {
  const { id } = await params;
  return <QuoteDetailView quoteId={id} />;
}
