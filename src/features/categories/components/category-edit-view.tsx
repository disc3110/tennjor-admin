"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, RotateCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { PageHeader } from "@/src/components/ui/page-header";
import {
  CategoryForm,
  type CategoryFormValues,
} from "@/src/features/categories/components/category-form";
import { CategoryStatusBadge } from "@/src/features/categories/components/category-status-badge";
import { useCategoryEdit } from "@/src/features/categories/hooks/use-category-edit";
import type { UpdateCategoryPayload } from "@/src/features/categories/types/category";

type CategoryEditViewProps = {
  categoryId: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

export function CategoryEditView({ categoryId }: CategoryEditViewProps) {
  const router = useRouter();
  const {
    category,
    isLoading,
    isSaving,
    error,
    successMessage,
    saveCategory,
    uploadCategoryImage,
    deleteCategory,
    refetch,
  } = useCategoryEdit(categoryId);
  const [webFile, setWebFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);

  const handleSubmit = async (values: CategoryFormValues) => {
    const payload: UpdateCategoryPayload = {
      name: values.name,
      slug: values.slug,
      isActive: values.isActive,
    };
    await saveCategory(payload);
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <PageHeader title="Editar categoría" subtitle="Cargando datos de la categoría..." />
        <Card className="h-56 animate-pulse bg-slate-100" />
      </section>
    );
  }

  if (!category) {
    return (
      <Card className="py-14 text-center">
        <h2 className="text-lg font-semibold text-slate-900">Categoría no encontrada</h2>
        <p className="mt-2 text-sm text-slate-500">
          Es posible que la categoría haya sido eliminada o no esté disponible.
        </p>
      </Card>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Volver a categorías
        </Link>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            disabled={isSaving}
            onClick={() => {
              const accepted = window.confirm(
                "¿Eliminar esta categoría? Esto puede fallar si sus productos vinculados están referenciados por solicitudes de cotización.",
              );
              if (!accepted) return;

              deleteCategory()
                .then(() => router.replace("/admin/categories"))
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
        title={`Editar ${category.name}`}
        subtitle={`Actualizada ${formatDate(category.updatedAt)}`}
        action={<CategoryStatusBadge isActive={category.isActive} />}
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
          <CategoryForm
            key={`${category.id}-${category.updatedAt}`}
            initialValues={{
              name: category.name,
              slug: category.slug,
              isActive: category.isActive,
            }}
            isSaving={isSaving}
            submitLabel="Guardar cambios"
            onSubmit={handleSubmit}
          />
        </div>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Media de categoría</h2>
          <div className="mt-3 space-y-3">
            {[
              { label: "Web", slot: "web" as const, url: category.imageWebUrl, file: webFile },
              {
                label: "Móvil",
                slot: "mobile" as const,
                url: category.imageMobileUrl,
                file: mobileFile,
              },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {item.label}
                </p>
                {item.url ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={`${category.name} ${item.label}`}
                      className="mt-2 h-24 w-full rounded object-cover"
                    />
                    <p className="mt-2 truncate text-xs text-slate-400">{item.url}</p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">Sin imagen {item.label.toLowerCase()}</p>
                )}
                <div className="mt-3 space-y-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/avif"
                    onChange={(event) => {
                      const picked = event.target.files?.[0] ?? null;
                      if (item.slot === "web") setWebFile(picked);
                      else setMobileFile(picked);
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                    disabled={isSaving}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-slate-500">
                      {item.file ? item.file.name : "Ningún archivo seleccionado"}
                    </p>
                    <Button
                      variant="secondary"
                      className="h-8 px-3 text-xs"
                      disabled={isSaving || !item.file}
                      onClick={() => {
                        if (!item.file) return;
                        uploadCategoryImage(item.slot, item.file)
                          .then(() => {
                            if (item.slot === "web") setWebFile(null);
                            else setMobileFile(null);
                          })
                          .catch(() => {
                            // Errors are handled in hook state.
                          });
                      }}
                    >
                      {item.url ? "Reemplazar" : "Subir"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Resumen de productos</h2>
          <p className="mt-2 text-sm text-slate-600">
            {category._count.products} producto(s) vinculados actualmente a esta categoría.
          </p>
          {category.products.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">Aún no hay productos vinculados.</p>
          ) : (
            <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
              {category.products.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="block rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-start gap-3">
                    {product.images[0] ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.images[0].url}
                          alt={product.images[0].alt ?? product.name}
                          className="h-14 w-14 rounded object-cover"
                        />
                      </>
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">
                        Sin imagen
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{product.name}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">{product.slug}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {product.variants.length} variante(s)
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
              {category.products.length > 12 ? (
                <p className="text-xs text-slate-500">Desplázate para ver más productos.</p>
              ) : null}
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
