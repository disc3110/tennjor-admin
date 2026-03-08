import { ProductEditView } from "@/src/features/products/components/product-edit-view";

type AdminProductEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductEditPage({ params }: AdminProductEditPageProps) {
  const { id } = await params;
  return <ProductEditView productId={id} />;
}
