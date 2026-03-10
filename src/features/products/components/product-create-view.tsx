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
import {
  mapPriorityToOrder,
  productImagePriorityOptions,
  type ProductImagePriority,
} from "@/src/features/products/utils/image-priority";

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
  const [initialImagePriority, setInitialImagePriority] = useState<ProductImagePriority>("cover");

  const handleSubmit = async (values: ProductFormValues) => {
    const baseCostInput = values.baseCost.trim();
    const parsedBaseCost =
      baseCostInput.length > 0 && Number.isFinite(Number(baseCostInput))
        ? Number(baseCostInput)
        : undefined;
    const payload: CreateAdminProductPayload = {
      name: values.name,
      slug: values.slug,
      categoryId: values.categoryId,
      description: values.description || undefined,
      isActive: values.isActive,
      baseCost: parsedBaseCost,
      costCurrency: values.costCurrency || "MXN",
    };

    const initialImage = initialImageFile
      ? {
          file: initialImageFile,
          alt: initialImageAlt.trim() || undefined,
          order: mapPriorityToOrder(initialImagePriority, []),
        }
      : undefined;

    const { product, imageUploadFailed } = await createProductWithOptionalImage(
      payload,
      initialImage,
    );
    if (product) {
      if (imageUploadFailed) {
        window.alert(
          "El producto se creó, pero falló la carga de la imagen inicial. Puedes reintentar desde la página de edición del producto.",
        );
      }
      router.replace(`/admin/products/${product.id}`);
    }
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <PageHeader title="Nuevo producto" subtitle="Cargando datos del formulario..." />
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
          Volver a productos
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
          Recargar
        </Button>
      </div>

      <PageHeader
        title="Crear producto"
        subtitle="Crea el producto base y opcionalmente sube una imagen inicial."
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
              baseCost: "",
              costCurrency: "MXN",
            }}
            categories={categories}
            isSaving={isSaving}
            submitLabel="Crear producto"
            onSubmit={handleSubmit}
          />
        </div>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Imagen inicial (opcional)</h2>
          <p className="mt-2 text-sm text-slate-600">
            Si se selecciona, la imagen se subirá inmediatamente después de crear el producto usando la ruta de subida del backend.
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
              {initialImageFile ? `Seleccionado: ${initialImageFile.name}` : "Ningún archivo seleccionado"}
            </p>
            <Input
              placeholder="Texto alternativo (opcional)"
              value={initialImageAlt}
              onChange={(event) => setInitialImageAlt(event.target.value)}
              disabled={isSaving}
            />
            <select
              value={initialImagePriority}
              onChange={(event) =>
                setInitialImagePriority(event.target.value as ProductImagePriority)
              }
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              disabled={isSaving}
            >
              {productImagePriorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </Card>
      </div>
    </section>
  );
}
