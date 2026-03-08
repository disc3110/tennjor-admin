import { CategoryEditView } from "@/src/features/categories/components/category-edit-view";

type AdminCategoryEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminCategoryEditPage({ params }: AdminCategoryEditPageProps) {
  const { id } = await params;
  return <CategoryEditView categoryId={id} />;
}
