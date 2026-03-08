"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import type { CategoryAdmin } from "@/src/features/products/types/product";

export type ProductFormValues = {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  isActive: boolean;
};

type ProductFormProps = {
  initialValues: ProductFormValues;
  categories: CategoryAdmin[];
  isSaving: boolean;
  submitLabel: string;
  onSubmit: (payload: ProductFormValues) => Promise<void>;
};

export function ProductForm({
  initialValues,
  categories,
  isSaving,
  submitLabel,
  onSubmit,
}: ProductFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [slug, setSlug] = useState(initialValues.slug);
  const [description, setDescription] = useState(initialValues.description);
  const [categoryId, setCategoryId] = useState(initialValues.categoryId);
  const [isActive, setIsActive] = useState(initialValues.isActive);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      categoryId,
      isActive,
    });
  };

  return (
    <Card>
      <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Name</span>
            <Input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Slug</span>
            <Input value={slug} onChange={(event) => setSlug(event.target.value)} required />
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-shadow placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Category</span>
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              required
            >
              {categories.length === 0 ? <option value="">No categories available</option> : null}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} {category.isActive ? "" : "(Inactive)"}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-lg border border-slate-300 px-3 py-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="size-4 rounded border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">Product is active</span>
          </label>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving || categories.length === 0}>
            {isSaving ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
