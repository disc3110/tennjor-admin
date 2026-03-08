import { ProductVariantsView } from "@/src/features/products/components/product-variants-view";

type AdminProductVariantsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductVariantsPage({
  params,
}: AdminProductVariantsPageProps) {
  const { id } = await params;
  return <ProductVariantsView productId={id} />;
}
