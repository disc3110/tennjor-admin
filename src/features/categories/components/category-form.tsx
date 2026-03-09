"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";

export type CategoryFormValues = {
  name: string;
  slug: string;
  isActive: boolean;
};

type CategoryFormProps = {
  initialValues: CategoryFormValues;
  isSaving: boolean;
  submitLabel: string;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
};

export function CategoryForm({
  initialValues,
  isSaving,
  submitLabel,
  onSubmit,
}: CategoryFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [slug, setSlug] = useState(initialValues.slug);
  const [isActive, setIsActive] = useState(initialValues.isActive);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      name: name.trim(),
      slug: slug.trim(),
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

        <label className="inline-flex items-center gap-3 rounded-lg border border-slate-300 px-3 py-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="size-4 rounded border-slate-300"
          />
          <span className="text-sm font-medium text-slate-700">Category is active</span>
        </label>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
