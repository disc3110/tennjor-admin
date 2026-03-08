"use client";

import Link from "next/link";
import { ArrowLeft, RotateCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { PageHeader } from "@/src/components/ui/page-header";
import { ProductVariantCreateForm } from "@/src/features/products/components/product-variant-create-form";
import { ProductVariantRangeGenerator } from "@/src/features/products/components/product-variant-range-generator";
import { ProductVariantsTable } from "@/src/features/products/components/product-variants-table";
import { useProductVariants } from "@/src/features/products/hooks/use-product-variants";

type ProductVariantsViewProps = {
  productId: string;
};

export function ProductVariantsView({ productId }: ProductVariantsViewProps) {
  const {
    product,
    variants,
    isLoading,
    isSaving,
    error,
    successMessage,
    loadProduct,
    createVariant,
    updateVariant,
    toggleVariantActive,
    createVariantsFromRange,
    deleteVariant,
  } = useProductVariants(productId);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <PageHeader title="Variants" subtitle="Loading product variants..." />
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
          href={`/admin/products/${product.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Back to product
        </Link>
        <Button
          variant="secondary"
          iconLeft={<RotateCw className="size-4" />}
          onClick={() => {
            loadProduct().catch(() => {
              // Refetch errors are handled in hook state.
            });
          }}
        >
          Reload
        </Button>
      </div>

      <PageHeader
        title={`Variants • ${product.name}`}
        subtitle="Manage shoe sizes, colors, stock, and availability."
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
          <Card className="p-0">
            <ProductVariantsTable
              variants={variants}
              isSaving={isSaving}
              onToggleStatus={(variant) => {
                toggleVariantActive(variant).catch(() => {
                  // Errors are handled in hook state.
                });
              }}
              onUpdate={(variantId, payload) => {
                updateVariant(variantId, payload).catch(() => {
                  // Errors are handled in hook state.
                });
              }}
              onDelete={(variantId) => {
                deleteVariant(variantId).catch(() => {
                  // Errors are handled in hook state.
                });
              }}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <ProductVariantCreateForm
            isSaving={isSaving}
            onSubmit={(payload) => {
              createVariant(payload).catch(() => {
                // Errors are handled in hook state.
              });
            }}
          />

          <ProductVariantRangeGenerator
            isSaving={isSaving}
            onCreateRange={(input) => {
              createVariantsFromRange(input).catch(() => {
                // Errors are handled in hook state.
              });
            }}
          />
        </div>
      </div>
    </section>
  );
}
