"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { PageHeader } from "@/src/components/ui/page-header";
import { ProductForm, type ProductFormValues } from "@/src/features/products/components/product-form";
import { useProductCreate } from "@/src/features/products/hooks/use-product-create";
import type { CreateAdminProductPayload } from "@/src/features/products/types/product";

export function ProductCreateView() {
  const router = useRouter();
  const {
    categories,
    isLoading,
    isSaving,
    error,
    successMessage,
    createProductWithOptionalImage,
    refetch,
  } = useProductCreate();
  const [initialImageFile, setInitialImageFile] = useState<File | null>(null);
  const [initialImageAlt, setInitialImageAlt] = useState("");
  const [initialImageOrder, setInitialImageOrder] = useState("0");

  const handleSubmit = async (values: ProductFormValues) => {
    const payload: CreateAdminProductPayload = {
      name: values.name,
      slug: values.slug,
      categoryId: values.categoryId,
      description: values.description || undefined,
      isActive: values.isActive,
    };

    const initialImage = initialImageFile
      ? {
          file: initialImageFile,
          alt: initialImageAlt.trim() || undefined,
          order:
            initialImageOrder.trim().length > 0 && !Number.isNaN(Number(initialImageOrder))
              ? Number(initialImageOrder)
              : undefined,
        }
      : undefined;

    const { product, imageUploadFailed } = await createProductWithOptionalImage(
      payload,
      initialImage,
    );
    if (product) {
      if (imageUploadFailed) {
        window.alert(
          "Product created, but initial image upload failed. You can retry from the product edit page.",
        );
      }
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
        subtitle="Create the base product and optionally upload one initial image."
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
          <h2 className="text-lg font-semibold text-slate-900">Initial Image (Optional)</h2>
          <p className="mt-2 text-sm text-slate-600">
            If selected, the image will be uploaded right after product creation using the backend
            upload route.
          </p>

          <div className="mt-4 space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setInitialImageFile(event.target.files?.[0] ?? null)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              disabled={isSaving}
            />
            <p className="text-xs text-slate-500">
              {initialImageFile ? `Selected: ${initialImageFile.name}` : "No file selected"}
            </p>
            <Input
              placeholder="Alt text (optional)"
              value={initialImageAlt}
              onChange={(event) => setInitialImageAlt(event.target.value)}
              disabled={isSaving}
            />
            <Input
              type="number"
              min={0}
              placeholder="Order (optional)"
              value={initialImageOrder}
              onChange={(event) => setInitialImageOrder(event.target.value)}
              disabled={isSaving}
            />
          </div>
        </Card>
      </div>
    </section>
  );
}
