"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { PageHeader } from "@/src/components/ui/page-header";
import {
  CategoryForm,
  type CategoryFormValues,
} from "@/src/features/categories/components/category-form";
import { useCategoryCreate } from "@/src/features/categories/hooks/use-category-create";
import type { CreateCategoryPayload } from "@/src/features/categories/types/category";

export function CategoryCreateView() {
  const router = useRouter();
  const { isSaving, error, successMessage, createCategory } = useCategoryCreate();

  const handleSubmit = async (values: CategoryFormValues) => {
    const payload: CreateCategoryPayload = {
      name: values.name,
      slug: values.slug,
      isActive: values.isActive,
      imageWebUrl: values.imageWebUrl || undefined,
      imageMobileUrl: values.imageMobileUrl || undefined,
    };

    const category = await createCategory(payload);
    if (category) {
      router.replace(`/admin/categories/${category.id}`);
    }
  };

  return (
    <section className="space-y-6">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="size-4" />
        Back to categories
      </Link>

      <PageHeader title="Create Category" subtitle="Create a category for storefront grouping." />

      {error ? (
        <Card>
          <p className="text-sm font-medium text-red-600">{error}</p>
        </Card>
      ) : null}

      {successMessage ? (
        <Card>
          <p className="text-sm font-medium text-emerald-700">{successMessage}</p>
        </Card>
      ) : null}

      <CategoryForm
        initialValues={{
          name: "",
          slug: "",
          isActive: true,
          imageWebUrl: "",
          imageMobileUrl: "",
        }}
        isSaving={isSaving}
        submitLabel="Create Category"
        onSubmit={handleSubmit}
      />
    </section>
  );
}
