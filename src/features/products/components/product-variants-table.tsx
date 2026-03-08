"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ProductStatusBadge } from "@/src/features/products/components/product-status-badge";
import type { ProductAdminVariant, UpdateProductVariantPayload } from "@/src/features/products/types/product";

type ProductVariantsTableProps = {
  variants: ProductAdminVariant[];
  isSaving: boolean;
  onToggleStatus: (variant: ProductAdminVariant) => void;
  onUpdate: (variantId: string, payload: UpdateProductVariantPayload) => void;
};

type VariantDraft = {
  size: string;
  color: string;
  sku: string;
  stock: number;
  isActive: boolean;
};

export function ProductVariantsTable({
  variants,
  isSaving,
  onToggleStatus,
  onUpdate,
}: ProductVariantsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<VariantDraft | null>(null);

  const startEdit = (variant: ProductAdminVariant) => {
    setEditingId(variant.id);
    setDraft({
      size: variant.size,
      color: variant.color,
      sku: variant.sku ?? "",
      stock: variant.stock,
      isActive: variant.isActive,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  const saveEdit = () => {
    if (!editingId || !draft) return;

    onUpdate(editingId, {
      size: draft.size.trim(),
      color: draft.color.trim(),
      sku: draft.sku.trim() || undefined,
      stock: draft.stock,
      isActive: draft.isActive,
    });
    cancelEdit();
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Size</th>
            <th className="px-4 py-3">Color</th>
            <th className="px-4 py-3">SKU</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {variants.map((variant) => {
            const isEditing = editingId === variant.id && draft;

            return (
              <tr key={variant.id}>
                <td className="px-4 py-4">
                  {isEditing ? (
                    <Input
                      className="h-9"
                      value={draft.size}
                      onChange={(event) => setDraft({ ...draft, size: event.target.value })}
                    />
                  ) : (
                    <span className="text-sm text-slate-800">{variant.size}</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  {isEditing ? (
                    <Input
                      className="h-9"
                      value={draft.color}
                      onChange={(event) => setDraft({ ...draft, color: event.target.value })}
                    />
                  ) : (
                    <span className="text-sm text-slate-800">{variant.color}</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  {isEditing ? (
                    <Input
                      className="h-9"
                      value={draft.sku}
                      onChange={(event) => setDraft({ ...draft, sku: event.target.value })}
                    />
                  ) : (
                    <span className="text-sm text-slate-600">{variant.sku ?? "-"}</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  {isEditing ? (
                    <Input
                      className="h-9"
                      type="number"
                      min={0}
                      value={draft.stock}
                      onChange={(event) =>
                        setDraft({ ...draft, stock: Number(event.target.value || "0") })
                      }
                    />
                  ) : (
                    <span className="text-sm text-slate-800">{variant.stock}</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  {isEditing ? (
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={draft.isActive}
                        onChange={(event) =>
                          setDraft({ ...draft, isActive: event.target.checked })
                        }
                      />
                      Active
                    </label>
                  ) : (
                    <ProductStatusBadge isActive={variant.isActive} />
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    {isEditing ? (
                      <>
                        <Button variant="secondary" onClick={cancelEdit}>
                          Cancel
                        </Button>
                        <Button disabled={isSaving} onClick={saveEdit}>
                          Save
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" onClick={() => startEdit(variant)}>
                          Edit
                        </Button>
                        <Button
                          variant="secondary"
                          disabled={isSaving}
                          onClick={() => onToggleStatus(variant)}
                        >
                          {variant.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
