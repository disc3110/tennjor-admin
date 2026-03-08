"use client";

import Link from "next/link";
import { ArrowLeft, RotateCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { PageHeader } from "@/src/components/ui/page-header";
import { ProductForm, type ProductFormValues } from "@/src/features/products/components/product-form";
import { ProductImagesPanel } from "@/src/features/products/components/product-images-panel";
import { ProductStatusBadge } from "@/src/features/products/components/product-status-badge";
import { useProductEdit } from "@/src/features/products/hooks/use-product-edit";
import type { UpdateAdminProductPayload } from "@/src/features/products/types/product";

type ProductEditViewProps = {
  productId: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

export function ProductEditView({ productId }: ProductEditViewProps) {
  const {
    product,
    categories,
    isLoading,
    isSaving,
    error,
    successMessage,
    saveProduct,
    refetch,
  } = useProductEdit(productId);

  const handleSubmit = async (values: ProductFormValues) => {
    const payload: UpdateAdminProductPayload = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      categoryId: values.categoryId,
      isActive: values.isActive,
    };
    await saveProduct(payload);
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <PageHeader title="Edit Product" subtitle="Loading product data..." />
        <Card className="h-56 animate-pulse bg-slate-100" />
      </section>
    );
  }

  if (!product) {
    return (
      <Card className="py-14 text-center">
        <h2 className="text-lg font-semibold text-slate-900">Product not found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The product may have been removed or is unavailable.
        </p>
      </Card>
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
        title={`Edit ${product.name}`}
        subtitle={`Updated ${formatDate(product.updatedAt)}`}
        action={<ProductStatusBadge isActive={product.isActive} />}
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
            key={`${product.id}-${product.updatedAt}`}
            initialValues={{
              name: product.name,
              slug: product.slug,
              description: product.description ?? "",
              categoryId: product.category.id,
              isActive: product.isActive,
            }}
            categories={categories}
            isSaving={isSaving}
            submitLabel="Save Changes"
            onSubmit={handleSubmit}
          />

          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Variants Summary</h2>
              <Link
                href={`/admin/products/${product.id}/variants`}
                className="text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
              >
                Manage Variants
              </Link>
            </div>
            {product.variants.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No variants configured for this product.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    <p className="text-slate-700">
                      {variant.size} / {variant.color} {variant.sku ? `(${variant.sku})` : ""}
                    </p>
                    <p className="text-slate-500">
                      Stock: {variant.stock} • {variant.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <ProductImagesPanel images={product.images} productName={product.name} />
      </div>
    </section>
  );
}
