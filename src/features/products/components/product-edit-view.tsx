"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const {
    product,
    categories,
    isLoading,
    isSaving,
    error,
    successMessage,
    saveProduct,
    uploadProductImage,
    updateProductImage,
    deleteProductImage,
    deleteProduct,
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
        <PageHeader title="Editar producto" subtitle="Cargando datos del producto..." />
        <Card className="h-56 animate-pulse bg-slate-100" />
      </section>
    );
  }

  if (!product) {
    return (
      <Card className="py-14 text-center">
        <h2 className="text-lg font-semibold text-slate-900">Producto no encontrado</h2>
        <p className="mt-2 text-sm text-slate-500">
          Es posible que el producto haya sido eliminado o no esté disponible.
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
          Volver a productos
        </Link>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            disabled={isSaving}
            onClick={() => {
              const accepted = window.confirm(
                "¿Eliminar este producto? Esta acción no se puede deshacer y puede fallar si está vinculado a solicitudes de cotización.",
              );
              if (!accepted) return;

              deleteProduct()
                .then(() => router.replace("/admin/products"))
                .catch(() => {
                  // Errors are handled in hook state.
                });
            }}
          >
            Eliminar
          </Button>
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
      </div>

      <PageHeader
        title={`Editar ${product.name}`}
        subtitle={`Actualizado ${formatDate(product.updatedAt)}`}
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
            submitLabel="Guardar cambios"
            onSubmit={handleSubmit}
          />

          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Resumen de variantes</h2>
              <Link
                href={`/admin/products/${product.id}/variants`}
                className="text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
              >
                Gestionar variantes
              </Link>
            </div>
            {product.variants.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No hay variantes configuradas para este producto.</p>
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
                      Stock: {variant.stock} • {variant.isActive ? "Activo" : "Inactivo"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <ProductImagesPanel
          images={product.images}
          productName={product.name}
          isSaving={isSaving}
          onUploadImage={(payload) => {
            uploadProductImage(payload).catch(() => {
              // Errors are handled in hook state.
            });
          }}
          onUpdateImage={(imageId, payload) => {
            updateProductImage(imageId, payload).catch(() => {
              // Errors are handled in hook state.
            });
          }}
          onDeleteImage={(imageId) => {
            deleteProductImage(imageId).catch(() => {
              // Errors are handled in hook state.
            });
          }}
        />
      </div>
    </section>
  );
}
