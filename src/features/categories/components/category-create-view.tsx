"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  const { isSaving, error, successMessage, createCategoryWithOptionalImages } =
    useCategoryCreate();
  const [webImageFile, setWebImageFile] = useState<File | null>(null);
  const [mobileImageFile, setMobileImageFile] = useState<File | null>(null);
  const webPreview = useMemo(
    () => (webImageFile ? URL.createObjectURL(webImageFile) : null),
    [webImageFile],
  );
  const mobilePreview = useMemo(
    () => (mobileImageFile ? URL.createObjectURL(mobileImageFile) : null),
    [mobileImageFile],
  );

  useEffect(() => {
    return () => {
      if (webPreview) URL.revokeObjectURL(webPreview);
    };
  }, [webPreview]);

  useEffect(() => {
    return () => {
      if (mobilePreview) URL.revokeObjectURL(mobilePreview);
    };
  }, [mobilePreview]);

  const handleSubmit = async (values: CategoryFormValues) => {
    const payload: CreateCategoryPayload = {
      name: values.name,
      slug: values.slug,
      isActive: values.isActive,
    };

    const { category, imageUploadFailed } = await createCategoryWithOptionalImages(payload, {
      webFile: webImageFile ?? undefined,
      mobileFile: mobileImageFile ?? undefined,
    });
    if (category) {
      if (imageUploadFailed) {
        window.alert(
          "La categoría se creó, pero falló una o más cargas de imagen. Puedes reintentar en la página de edición.",
        );
      }
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
        Volver a categorías
      </Link>

      <PageHeader title="Crear categoría" subtitle="Crea una categoría para agrupar productos en tienda." />

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
        }}
        isSaving={isSaving}
        submitLabel="Crear categoría"
        onSubmit={handleSubmit}
      />

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Imágenes de categoría (opcional)</h2>
        <p className="mt-2 text-sm text-slate-600">
          Las imágenes se cargan después de crear la categoría mediante rutas de media gestionadas por backend.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {[
            {
              label: "Imagen web",
              file: webImageFile,
              preview: webPreview,
              setFile: setWebImageFile,
            },
            {
              label: "Imagen móvil",
              file: mobileImageFile,
              preview: mobilePreview,
              setFile: setMobileImageFile,
            },
          ].map((slot) => (
            <div key={slot.label} className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {slot.label}
              </p>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/avif"
                onChange={(event) => slot.setFile(event.target.files?.[0] ?? null)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                disabled={isSaving}
              />
              <p className="mt-2 truncate text-xs text-slate-500">
                {slot.file ? slot.file.name : "Ningún archivo seleccionado"}
              </p>
              {slot.preview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slot.preview}
                    alt={slot.label}
                    className="mt-2 h-24 w-full rounded object-cover"
                  />
                </>
              ) : (
                <div className="mt-2 flex h-24 items-center justify-center rounded bg-slate-50 text-xs text-slate-400">
                  Sin vista previa
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
