"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { PageHeader } from "@/src/components/ui/page-header";
import { SalesQuoteStatusBadge } from "@/src/features/sales-quotes/components/sales-quote-status-badge";
import { useSalesQuoteDetail } from "@/src/features/sales-quotes/hooks/use-sales-quote-detail";
import type {
  InternalDiscountType,
  InternalSaleQuoteItem,
} from "@/src/features/sales-quotes/types/sales-quote";
import { formatDateTime, formatMoney, formatPercent, toNumber } from "@/src/features/sales/utils/format";

type SalesQuoteDetailViewProps = {
  quoteId: string;
};

const discountOptions: Array<{ label: string; value: InternalDiscountType }> = [
  { label: "Fixed", value: "FIXED" },
  { label: "Percentage", value: "PERCENTAGE" },
];

export function SalesQuoteDetailView({ quoteId }: SalesQuoteDetailViewProps) {
  const router = useRouter();
  const {
    quote,
    productOptions,
    isLoading,
    isSaving,
    error,
    successMessage,
    refetch,
    updateHeader,
    addItem,
    updateItem,
    deleteItem,
    recalculate,
    completeSale,
  } = useSalesQuoteDetail(quoteId);

  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [itemDraft, setItemDraft] = useState({
    productId: "",
    variantId: "",
    quantity: "1",
    unitSalePrice: "0",
    unitCostSnapshot: "",
    discountType: "",
    discountValue: "",
    sortOrder: "0",
  });

  const selectedProduct = useMemo(
    () => productOptions.find((product) => product.id === itemDraft.productId),
    [itemDraft.productId, productOptions],
  );

  if (isLoading) {
    return (
      <section className="space-y-6">
        <PageHeader title="Sales Quote" subtitle="Loading quote data..." />
        <Card className="h-56 animate-pulse bg-slate-100" />
      </section>
    );
  }

  if (!quote) {
    return (
      <Card className="py-14 text-center">
        <h2 className="text-lg font-semibold text-slate-900">Sales quote not found</h2>
        <p className="mt-2 text-sm text-slate-500">The quote may have been removed.</p>
      </Card>
    );
  }

  const isEditable = quote.status === "DRAFT";

  const handleHeaderSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await updateHeader({
      customerName: String(formData.get("customerName") ?? "").trim(),
      customerPhone: String(formData.get("customerPhone") ?? "").trim() || undefined,
      customerEmail: String(formData.get("customerEmail") ?? "").trim() || undefined,
      customerCity: String(formData.get("customerCity") ?? "").trim() || undefined,
      notes: String(formData.get("notes") ?? "").trim() || undefined,
      currency: String(formData.get("currency") ?? "").trim() || undefined,
      discountTotal: String(formData.get("discountTotal") ?? "").trim()
        ? Number(formData.get("discountTotal"))
        : undefined,
    });
  };

  const handleAddItem = async () => {
    await addItem({
      productId: itemDraft.productId,
      variantId: itemDraft.variantId || undefined,
      quantity: Number(itemDraft.quantity),
      unitSalePrice: Number(itemDraft.unitSalePrice),
      unitCostSnapshot: itemDraft.unitCostSnapshot.trim()
        ? Number(itemDraft.unitCostSnapshot)
        : undefined,
      discountType: (itemDraft.discountType as InternalDiscountType) || undefined,
      discountValue: itemDraft.discountValue.trim() ? Number(itemDraft.discountValue) : undefined,
      sortOrder: Number(itemDraft.sortOrder || 0),
    });

    setItemDraft({
      productId: "",
      variantId: "",
      quantity: "1",
      unitSalePrice: "0",
      unitCostSnapshot: "",
      discountType: "",
      discountValue: "",
      sortOrder: "0",
    });
  };

  const handleCompleteSale = async () => {
    const confirmed = window.confirm(
      "Complete this quote into a finalized sale? This action should only be used when quote data is final.",
    );
    if (!confirmed) return;

    const result = await completeSale();
    if (result?.sale?.id) {
      router.replace(`/admin/sales/${result.sale.id}`);
    } else {
      router.replace("/admin/sales");
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/sales-quotes"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Back to sales quotes
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
        title={quote.code}
        subtitle={`Created ${formatDateTime(quote.createdAt)}`}
        action={<SalesQuoteStatusBadge status={quote.status} />}
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
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Quote Header</h2>
            {!isEditable ? (
              <p className="text-xs font-medium text-amber-700">
                This quote is no longer editable because its status is {quote.status}.
              </p>
            ) : null}
            <form
              key={quote.updatedAt}
              onSubmit={(event) => {
                handleHeaderSave(event).catch(() => {
                  // Errors are handled in hook state.
                });
              }}
              className="space-y-4"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  name="customerName"
                  defaultValue={quote.customerName}
                  placeholder="Customer name"
                  disabled={!isEditable || isSaving}
                />
                <Input
                  name="currency"
                  defaultValue={quote.currency}
                  placeholder="Currency"
                  disabled={!isEditable || isSaving}
                />
                <Input
                  name="customerPhone"
                  defaultValue={quote.customerPhone ?? ""}
                  placeholder="Customer phone"
                  disabled={!isEditable || isSaving}
                />
                <Input
                  name="customerEmail"
                  defaultValue={quote.customerEmail ?? ""}
                  placeholder="Customer email"
                  disabled={!isEditable || isSaving}
                />
                <Input
                  name="customerCity"
                  defaultValue={quote.customerCity ?? ""}
                  placeholder="Customer city"
                  disabled={!isEditable || isSaving}
                />
                <Input
                  name="discountTotal"
                  type="number"
                  min={0}
                  step="0.01"
                  defaultValue={String(toNumber(quote.discountTotal))}
                  placeholder="Discount total"
                  disabled={!isEditable || isSaving}
                />
                <textarea
                  name="notes"
                  defaultValue={quote.notes ?? ""}
                  className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 md:col-span-2"
                  placeholder="Notes"
                  disabled={!isEditable || isSaving}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving || !isEditable}>
                  {isSaving ? "Saving..." : "Save Header"}
                </Button>
              </div>
            </form>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Quote Items</h2>
              <Button variant="secondary" onClick={() => void recalculate()} disabled={isSaving}>
                Recalculate Totals
              </Button>
            </div>

            <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-2">
              <select
                value={itemDraft.productId}
                onChange={(event) => {
                  const nextProduct = productOptions.find((product) => product.id === event.target.value);
                  setItemDraft((current) => ({
                    ...current,
                    productId: event.target.value,
                    variantId: "",
                    unitCostSnapshot:
                      nextProduct?.baseCost != null ? String(nextProduct.baseCost) : current.unitCostSnapshot,
                  }));
                }}
                className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
                disabled={!isEditable || isSaving}
              >
                <option value="">Select product</option>
                {productOptions.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>

              <select
                value={itemDraft.variantId}
                onChange={(event) =>
                  setItemDraft((current) => ({ ...current, variantId: event.target.value }))
                }
                className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
                disabled={!isEditable || isSaving || !selectedProduct}
              >
                <option value="">Variant (optional)</option>
                {(selectedProduct?.variants ?? []).map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.size} / {variant.color} {variant.sku ? `(${variant.sku})` : ""}
                  </option>
                ))}
              </select>

              <Input
                type="number"
                min={1}
                value={itemDraft.quantity}
                onChange={(event) =>
                  setItemDraft((current) => ({ ...current, quantity: event.target.value }))
                }
                placeholder="Quantity"
                disabled={!isEditable || isSaving}
              />
              <Input
                type="number"
                min={0}
                step="0.01"
                value={itemDraft.unitSalePrice}
                onChange={(event) =>
                  setItemDraft((current) => ({ ...current, unitSalePrice: event.target.value }))
                }
                placeholder="Unit sale price"
                disabled={!isEditable || isSaving}
              />
              <Input
                type="number"
                min={0}
                step="0.01"
                value={itemDraft.unitCostSnapshot}
                onChange={(event) =>
                  setItemDraft((current) => ({ ...current, unitCostSnapshot: event.target.value }))
                }
                placeholder="Unit cost snapshot (optional)"
                disabled={!isEditable || isSaving}
              />
              <select
                value={itemDraft.discountType}
                onChange={(event) =>
                  setItemDraft((current) => ({ ...current, discountType: event.target.value }))
                }
                className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
                disabled={!isEditable || isSaving}
              >
                <option value="">Discount type (optional)</option>
                {discountOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={itemDraft.discountValue}
                onChange={(event) =>
                  setItemDraft((current) => ({ ...current, discountValue: event.target.value }))
                }
                placeholder="Discount value"
                disabled={!isEditable || isSaving || !itemDraft.discountType}
              />
              <Input
                type="number"
                min={0}
                value={itemDraft.sortOrder}
                onChange={(event) =>
                  setItemDraft((current) => ({ ...current, sortOrder: event.target.value }))
                }
                placeholder="Sort order"
                disabled={!isEditable || isSaving}
              />
              <div className="md:col-span-2 flex justify-end">
                <Button
                  onClick={() => void handleAddItem()}
                  disabled={
                    isSaving ||
                    !isEditable ||
                    !itemDraft.productId ||
                    Number(itemDraft.quantity) <= 0
                  }
                >
                  {isSaving ? "Saving..." : "Add Item"}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2">Product</th>
                    <th className="px-3 py-2">Variant</th>
                    <th className="px-3 py-2">Qty</th>
                    <th className="px-3 py-2">Sale Price</th>
                    <th className="px-3 py-2">Cost</th>
                    <th className="px-3 py-2">Revenue</th>
                    <th className="px-3 py-2">Profit</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quote.items.map((item) => (
                    <QuoteItemRow
                      key={item.id}
                      item={item}
                      currency={quote.currency}
                      isEditable={isEditable}
                      isSaving={isSaving}
                      isEditing={editingItemId === item.id}
                      onStartEdit={() => setEditingItemId(item.id)}
                      onCancelEdit={() => setEditingItemId(null)}
                      onSave={async (payload) => {
                        await updateItem(item.id, payload);
                        setEditingItemId(null);
                      }}
                      onDelete={async () => {
                        const confirmed = window.confirm("Delete this quote item?");
                        if (!confirmed) return;
                        await deleteItem(item.id);
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Quote Totals</h2>
            <InfoRow label="Subtotal" value={formatMoney(quote.subtotal, quote.currency)} />
            <InfoRow label="Discount" value={formatMoney(quote.discountTotal, quote.currency)} />
            <InfoRow label="Revenue" value={formatMoney(quote.totalRevenue, quote.currency)} />
            <InfoRow label="Cost" value={formatMoney(quote.totalCost, quote.currency)} />
            <InfoRow label="Profit" value={formatMoney(quote.totalProfit, quote.currency)} />
            <InfoRow label="Margin" value={formatPercent(quote.marginPct)} />
          </Card>

          <Card className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Context</h2>
            <InfoRow label="Quote ID" value={quote.id} />
            <InfoRow label="Status" value={quote.status} />
            <InfoRow label="Completed At" value={formatDateTime(quote.completedAt)} />
            <InfoRow
              label="Public Quote"
              value={quote.publicQuoteRequest ? `${quote.publicQuoteRequest.id} (${quote.publicQuoteRequest.status})` : "--"}
            />
            <InfoRow
              label="Created By"
              value={quote.createdBy ? `${quote.createdBy.name} (${quote.createdBy.email})` : "--"}
            />
          </Card>

          <Button
            className="w-full"
            disabled={isSaving || quote.items.length === 0 || quote.status === "COMPLETED"}
            onClick={() => void handleCompleteSale()}
          >
            {isSaving ? "Processing..." : "Complete Sale"}
          </Button>
        </div>
      </div>
    </section>
  );
}

type QuoteItemRowProps = {
  item: InternalSaleQuoteItem;
  currency: string;
  isEditable: boolean;
  isSaving: boolean;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: (payload: {
    quantity?: number;
    unitSalePrice?: number;
    unitCostSnapshot?: number;
    discountType?: InternalDiscountType;
    discountValue?: number;
    sortOrder?: number;
  }) => Promise<void>;
  onDelete: () => Promise<void>;
};

function QuoteItemRow({
  item,
  currency,
  isEditable,
  isSaving,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: QuoteItemRowProps) {
  const [draft, setDraft] = useState({
    quantity: String(item.quantity),
    unitSalePrice: String(toNumber(item.unitSalePrice)),
    unitCostSnapshot: String(toNumber(item.unitCostSnapshot)),
    discountType: item.discountType ?? "",
    discountValue: item.discountValue == null ? "" : String(toNumber(item.discountValue)),
    sortOrder: String(item.sortOrder),
  });

  if (!isEditing) {
    return (
      <tr className="text-sm text-slate-700">
        <td className="px-3 py-3">
          <p className="font-medium text-slate-900">{item.productNameSnapshot}</p>
          <p className="text-xs text-slate-500">{item.productSlugSnapshot}</p>
        </td>
        <td className="px-3 py-3">
          {item.sizeSnapshot || "--"} / {item.colorSnapshot || "--"}
        </td>
        <td className="px-3 py-3">{item.quantity}</td>
        <td className="px-3 py-3">{formatMoney(item.unitSalePrice, currency)}</td>
        <td className="px-3 py-3">{formatMoney(item.unitCostSnapshot, currency)}</td>
        <td className="px-3 py-3">{formatMoney(item.lineRevenue, currency)}</td>
        <td className="px-3 py-3">{formatMoney(item.lineProfit, currency)}</td>
        <td className="px-3 py-3">
          <div className="flex gap-2">
            <Button variant="secondary" disabled={!isEditable || isSaving} onClick={onStartEdit}>
              Edit
            </Button>
            <Button
              variant="ghost"
              disabled={!isEditable || isSaving}
              onClick={() => {
                onDelete().catch(() => {
                  // Errors are handled in hook state.
                });
              }}
              className="text-red-600 hover:bg-red-50"
            >
              Delete
            </Button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="bg-slate-50 text-sm text-slate-700">
      <td className="px-3 py-3" colSpan={8}>
        <div className="grid gap-2 md:grid-cols-3">
          <Input
            type="number"
            min={1}
            value={draft.quantity}
            onChange={(event) => setDraft((current) => ({ ...current, quantity: event.target.value }))}
          />
          <Input
            type="number"
            min={0}
            step="0.01"
            value={draft.unitSalePrice}
            onChange={(event) =>
              setDraft((current) => ({ ...current, unitSalePrice: event.target.value }))
            }
          />
          <Input
            type="number"
            min={0}
            step="0.01"
            value={draft.unitCostSnapshot}
            onChange={(event) =>
              setDraft((current) => ({ ...current, unitCostSnapshot: event.target.value }))
            }
          />
          <select
            value={draft.discountType}
            onChange={(event) => setDraft((current) => ({ ...current, discountType: event.target.value }))}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
          >
            <option value="">No discount</option>
            {discountOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={draft.discountValue}
            onChange={(event) =>
              setDraft((current) => ({ ...current, discountValue: event.target.value }))
            }
            disabled={!draft.discountType}
          />
          <Input
            type="number"
            min={0}
            value={draft.sortOrder}
            onChange={(event) => setDraft((current) => ({ ...current, sortOrder: event.target.value }))}
          />
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancelEdit} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave({
                quantity: Number(draft.quantity),
                unitSalePrice: Number(draft.unitSalePrice),
                unitCostSnapshot: Number(draft.unitCostSnapshot),
                discountType: (draft.discountType as InternalDiscountType) || undefined,
                discountValue: draft.discountValue.trim() ? Number(draft.discountValue) : undefined,
                sortOrder: Number(draft.sortOrder || 0),
              }).catch(() => {
                // Errors are handled in hook state.
              });
            }}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Item"}
          </Button>
        </div>
      </td>
    </tr>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}
