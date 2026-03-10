import { SaleDetailView } from "@/src/features/sales/components/sale-detail-view";

type AdminSaleDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminSaleDetailPage({ params }: AdminSaleDetailPageProps) {
  const { id } = await params;
  return <SaleDetailView saleId={id} />;
}
