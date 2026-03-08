"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { PageHeader } from "@/src/components/ui/page-header";
import { ProductForm, type ProductFormValues } from "@/src/features/products/components/product-form";
import { useProductCreate } from "@/src/features/products/hooks/use-product-create";
import type { CreateAdminProductPayload } from "@/src/features/products/types/product";

export function ProductCreateView() {
  const router = useRouter();
  const { categories, isLoading, isSaving, error, successMessage, createProduct, refetch } =
    useProductCreate();

  const handleSubmit = async (values: ProductFormValues) => {
    const payload: CreateAdminProductPayload = {
      name: values.name,
      slug: values.slug,
      categoryId: values.categoryId,
      description: values.description || undefined,
      isActive: values.isActive,
    };

    const product = await createProduct(payload);
    if (product) {
      router.replace(`/admin/products/${product.id}`);
    }
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <PageHeader title="New Product" subtitle="Loading form data..." />
        <Card className="h-56 animate-pulse bg-slate-100" />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Back to products
        </Link>
        <Button
          variant="secondary"
          iconLeft={<RotateCw className="size-4" />}
          onClick={() => {
            refetch().catch(() => {
              // Refetch errors are handled in hook state.
            });
          }}
        >
          Reload
        </Button>
      </div>

      <PageHeader
        title="Create Product"
        subtitle="Create the base product first, then manage images and variants."
      />

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

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <ProductForm
            initialValues={{
              name: "",
              slug: "",
              description: "",
              categoryId: categories[0]?.id ?? "",
              isActive: true,
            }}
            categories={categories}
            isSaving={isSaving}
            submitLabel="Create Product"
            onSubmit={handleSubmit}
          />
        </div>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Next Steps</h2>
          <p className="mt-2 text-sm text-slate-600">
            Images and variants are supported by the create contract, but this first create flow
            is intentionally limited to base product fields for a simpler admin experience.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            TODO: Add optional inline image/variant creation when the UX for nested inputs is
            finalized.
          </p>
        </Card>
      </div>
    </section>
  );
}
