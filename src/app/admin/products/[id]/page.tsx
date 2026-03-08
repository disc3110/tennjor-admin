import { ProductEditPlaceholderView } from "@/src/features/products/components/product-edit-placeholder-view";

type AdminProductEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductEditPage({ params }: AdminProductEditPageProps) {
  const { id } = await params;
  return <ProductEditPlaceholderView productId={id} />;
}
