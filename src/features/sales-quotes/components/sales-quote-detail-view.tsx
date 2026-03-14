"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronUp, RotateCw } from "lucide-react";
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
  { label: "Fijo", value: "FIXED" },
  { label: "Porcentaje", value: "PERCENTAGE" },
];

export function SalesQuoteDetailView({ quoteId }: SalesQuoteDetailViewProps) {
  const router = useRouter();
  const {
    quote,
    productOptions,
    productCostById,
    ensureProductCost,
    resolvingProductCostIds,
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
    addInternalNote,
    completeSale,
  } = useSalesQuoteDetail(quoteId);

  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [itemDraft, setItemDraft] = useState({
    productId: "",
    variantId: "",
    quantity: "1",
    unitSalePrice: "0",
    discountType: "",
    discountValue: "",
  });
  const [internalNoteDraft, setInternalNoteDraft] = useState("");
  const [isAddProductExpanded, setIsAddProductExpanded] = useState(false);
  const selectedProductId = itemDraft.productId;

  const selectedProduct = useMemo(
    () => productOptions.find((product) => product.id === selectedProductId),
    [selectedProductId, productOptions],
  );
  useEffect(() => {
    if (!selectedProductId) return;
    ensureProductCost(selectedProductId).catch(() => {
      // Keep UI fallback text when cost lookup fails.
    });
  }, [ensureProductCost, selectedProductId]);

  const resolvedSelectedProductCost = selectedProductId
    ? productCostById[selectedProductId]
    : undefined;
  const selectedProductBaseCost = useMemo(() => {
    const value = selectedProduct?.baseCost ?? resolvedSelectedProductCost?.baseCost;
    if (value == null) return null;
    if (typeof value === "string" && value.trim().length === 0) return null;
    return toNumber(value);
  }, [resolvedSelectedProductCost?.baseCost, selectedProduct?.baseCost]);
  const selectedProductCostCurrencyCandidate =
    selectedProduct?.costCurrency ?? resolvedSelectedProductCost?.costCurrency ?? quote?.currency ?? "MXN";
  const selectedProductCostCurrency =
    typeof selectedProductCostCurrencyCandidate === "string" && selectedProductCostCurrencyCandidate.trim().length > 0
      ? selectedProductCostCurrencyCandidate
      : "MXN";
  const estimatedQuantity = Number(itemDraft.quantity || 0);
  const estimatedRevenue = estimatedQuantity * Number(itemDraft.unitSalePrice || 0);
  const estimatedCost =
    selectedProductBaseCost != null ? estimatedQuantity * selectedProductBaseCost : null;
  const estimatedProfit = estimatedCost != null ? estimatedRevenue - estimatedCost : null;

  if (isLoading) {
    return (
      <section className="space-y-6">
        <PageHeader title="Cotización de venta" subtitle="Cargando datos de la cotización..." />
        <Card className="h-56 animate-pulse bg-slate-100" />
      </section>
    );
  }

  if (!quote) {
    return (
      <Card className="py-14 text-center">
        <h2 className="text-lg font-semibold text-slate-900">Cotización de venta no encontrada</h2>
        <p className="mt-2 text-sm text-slate-500">Es posible que la cotización haya sido eliminada.</p>
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
      discountType: (itemDraft.discountType as InternalDiscountType) || undefined,
      discountValue: itemDraft.discountValue.trim() ? Number(itemDraft.discountValue) : undefined,
    });

    setItemDraft({
      productId: "",
      variantId: "",
      quantity: "1",
      unitSalePrice: "0",
      discountType: "",
      discountValue: "",
    });
  };

  const handleAddInternalNote = async () => {
    const message = internalNoteDraft.trim();
    if (!message) return;
    await addInternalNote(message);
    setInternalNoteDraft("");
  };

  const handleCompleteSale = async () => {
    const confirmed = window.confirm(
      "¿Completar esta cotización y convertirla en una venta final? Esta acción debe usarse solo cuando los datos de la cotización sean definitivos.",
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
          Volver a cotizaciones de venta
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
        title={quote.code}
        subtitle={`Creada ${formatDateTime(quote.createdAt)}`}
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
            <h2 className="text-lg font-semibold text-slate-900">Encabezado de la cotización</h2>
            {!isEditable ? (
              <p className="text-xs font-medium text-amber-700">
                Esta cotización ya no se puede editar porque su estado es {quote.status}.
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
                  placeholder="Nombre del cliente"
                  disabled={!isEditable || isSaving}
                />
                <Input
                  name="currency"
                  defaultValue={quote.currency}
                  placeholder="Moneda"
                  disabled={!isEditable || isSaving}
                />
                <Input
                  name="customerPhone"
                  defaultValue={quote.customerPhone ?? ""}
                  placeholder="Teléfono del cliente"
                  disabled={!isEditable || isSaving}
                />
                <Input
                  name="customerEmail"
                  defaultValue={quote.customerEmail ?? ""}
                  placeholder="Correo del cliente"
                  disabled={!isEditable || isSaving}
                />
                <Input
                  name="customerCity"
                  defaultValue={quote.customerCity ?? ""}
                  placeholder="Ciudad del cliente"
                  disabled={!isEditable || isSaving}
                />
                <Input
                  name="discountTotal"
                  type="number"
                  min={0}
                  step="0.01"
                  defaultValue={String(toNumber(quote.discountTotal))}
                  placeholder="Descuento total"
                  disabled={!isEditable || isSaving}
                />
                <textarea
                  name="notes"
                  defaultValue={quote.notes ?? ""}
                  className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 md:col-span-2"
                  placeholder="Notas"
                  disabled={!isEditable || isSaving}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving || !isEditable}>
                  {isSaving ? "Guardando..." : "Guardar encabezado"}
                </Button>
              </div>
            </form>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Artículos de la cotización</h2>
              <Button variant="secondary" onClick={() => void recalculate()} disabled={isSaving}>
                Recalcular totales
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2">Producto</th>
                    <th className="px-3 py-2">Variante</th>
                    <th className="px-3 py-2">Cant.</th>
                    <th className="px-3 py-2">Precio venta</th>
                    <th className="px-3 py-2">Costo</th>
                    <th className="px-3 py-2">Ingresos</th>
                    <th className="px-3 py-2">Ganancia</th>
                    <th className="px-3 py-2">Acciones</th>
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
                        const confirmed = window.confirm("¿Eliminar este artículo de la cotización?");
                        if (!confirmed) return;
                        await deleteItem(item.id);
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Agregar producto</h3>
                  <p className="text-sm text-slate-600">
                    Completa los datos para agregar un nuevo artículo a la cotización.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="shrink-0 p-2"
                  aria-expanded={isAddProductExpanded}
                  aria-label={isAddProductExpanded ? "Contraer formulario de producto" : "Expandir formulario de producto"}
                  onClick={() => setIsAddProductExpanded((current) => !current)}
                >
                  {isAddProductExpanded ? (
                    <ChevronUp className="size-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="size-5 text-slate-500" />
                  )}
                </Button>
              </div>

              {isAddProductExpanded ? (
                <div className="mt-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Selección</p>
                  <label className="space-y-1 text-sm">
                    <span className="text-slate-700">Producto</span>
                    <select
                      value={itemDraft.productId}
                      onChange={(event) =>
                        setItemDraft((current) => ({
                          ...current,
                          productId: event.target.value,
                          variantId: "",
                        }))
                      }
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
                      disabled={!isEditable || isSaving}
                    >
                      <option value="">Seleccionar producto</option>
                      {productOptions.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-sm">
                    <span className="text-slate-700">Variante</span>
                    <select
                      value={itemDraft.variantId}
                      onChange={(event) =>
                        setItemDraft((current) => ({ ...current, variantId: event.target.value }))
                      }
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
                      disabled={!isEditable || isSaving || !selectedProduct}
                    >
                      <option value="">Sin variante</option>
                      {(selectedProduct?.variants ?? []).map((variant) => (
                        <option key={variant.id} value={variant.id}>
                          {variant.size} / {variant.color} {variant.sku ? `(${variant.sku})` : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Venta</p>
                  <label className="space-y-1 text-sm">
                    <span className="text-slate-700">Cantidad</span>
                    <Input
                      type="number"
                      min={1}
                      value={itemDraft.quantity}
                      onChange={(event) =>
                        setItemDraft((current) => ({ ...current, quantity: event.target.value }))
                      }
                      placeholder="Cantidad"
                      disabled={!isEditable || isSaving}
                    />
                  </label>
                  <label className="space-y-1 text-sm">
                    <span className="text-slate-700">Precio de venta por unidad</span>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      className="no-number-spinner"
                      value={itemDraft.unitSalePrice}
                      onChange={(event) =>
                        setItemDraft((current) => ({ ...current, unitSalePrice: event.target.value }))
                      }
                      placeholder="0.00"
                      disabled={!isEditable || isSaving}
                    />
                  </label>
                </div>
              </div>

                  <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Referencia</p>
                  <p className="text-sm font-medium text-slate-800">Costo base del producto</p>
                  <p className="text-sm text-slate-700">
                    {selectedProductId && resolvingProductCostIds[selectedProductId] && selectedProductBaseCost == null
                      ? "Cargando costo base..."
                      : selectedProductBaseCost != null
                      ? formatMoney(selectedProductBaseCost, selectedProductCostCurrency)
                      : "Sin costo base definido"}
                  </p>
                  <p className="text-xs text-slate-500">Se toma automáticamente del producto. Solo referencia.</p>
                </div>

                <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Descuento</p>
                  <label className="space-y-1 text-sm">
                    <span className="text-slate-700">Tipo de descuento</span>
                    <select
                      value={itemDraft.discountType}
                      onChange={(event) =>
                        setItemDraft((current) => ({ ...current, discountType: event.target.value }))
                      }
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
                      disabled={!isEditable || isSaving}
                    >
                      <option value="">Sin descuento</option>
                      {discountOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-sm">
                    <span className="text-slate-700">Descuento</span>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      className="no-number-spinner"
                      value={itemDraft.discountValue}
                      onChange={(event) =>
                        setItemDraft((current) => ({ ...current, discountValue: event.target.value }))
                      }
                      placeholder="0.00"
                      disabled={!isEditable || isSaving || !itemDraft.discountType}
                    />
                  </label>
                </div>
              </div>

                  <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Vista previa</p>
                  <InfoRow label="Ingreso estimado" value={formatMoney(estimatedRevenue, quote.currency)} />
                  <InfoRow
                    label="Costo estimado"
                    value={
                      estimatedCost != null
                        ? formatMoney(estimatedCost, selectedProductCostCurrency)
                        : "Sin costo base definido"
                    }
                  />
                  <InfoRow
                    label="Ganancia estimada"
                    value={estimatedProfit != null ? formatMoney(estimatedProfit, quote.currency) : "--"}
                  />
                </div>

                <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Acción</p>
                  <p className="text-sm text-slate-600">Revisa los valores antes de agregar el artículo.</p>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => void handleAddItem()}
                      disabled={
                        isSaving ||
                        !isEditable ||
                        !itemDraft.productId ||
                        Number(itemDraft.quantity) <= 0
                      }
                    >
                      {isSaving ? "Guardando..." : "Agregar artículo"}
                    </Button>
                  </div>
                </div>
              </div>
                </div>
              ) : null}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Totales de la cotización</h2>
            <InfoRow label="Subtotal" value={formatMoney(quote.subtotal, quote.currency)} />
            <InfoRow label="Descuento" value={formatMoney(quote.discountTotal, quote.currency)} />
            <InfoRow label="Ingresos" value={formatMoney(quote.totalRevenue, quote.currency)} />
            <InfoRow label="Costo" value={formatMoney(quote.totalCost, quote.currency)} />
            <InfoRow label="Ganancia" value={formatMoney(quote.totalProfit, quote.currency)} />
            <InfoRow label="Margen" value={formatPercent(quote.marginPct)} />
          </Card>

          <Card className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Contexto</h2>
            <InfoRow label="ID cotización" value={quote.id} />
            <InfoRow label="Estado" value={quote.status} />
            <InfoRow label="Completada" value={formatDateTime(quote.completedAt)} />
            <InfoRow
              label="Cotización pública"
              value={quote.publicQuoteRequest ? `${quote.publicQuoteRequest.id} (${quote.publicQuoteRequest.status})` : "--"}
            />
            <InfoRow
              label="Creada por"
              value={quote.createdBy ? `${quote.createdBy.name} (${quote.createdBy.email})` : "--"}
            />
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Notas internas</h2>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Agregar nota interna</span>
              <textarea
                className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                value={internalNoteDraft}
                onChange={(event) => setInternalNoteDraft(event.target.value)}
                placeholder="Escribe una nota para el equipo"
              />
            </label>
            <div className="flex justify-end">
              <Button
                disabled={isSaving || internalNoteDraft.trim().length === 0}
                onClick={() => void handleAddInternalNote()}
              >
                {isSaving ? "Guardando..." : "Agregar nota"}
              </Button>
            </div>

            {quote.internalNotes.length === 0 ? (
              <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
                Aún no hay notas internas en esta cotización.
              </p>
            ) : (
              <ul className="space-y-2">
                {quote.internalNotes.map((note) => (
                  <li key={note.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">
                      {(note.author?.name || note.author?.email || "Administrador")} • {formatDateTime(note.createdAt)}
                    </p>
                    <p className="mt-1 text-sm text-slate-800">{note.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Button
            className="w-full"
            disabled={isSaving || quote.items.length === 0 || quote.status === "COMPLETED"}
            onClick={() => void handleCompleteSale()}
          >
            {isSaving ? "Procesando..." : "Completar venta"}
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
    discountType?: InternalDiscountType;
    discountValue?: number;
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
    discountType: item.discountType ?? "",
    discountValue: item.discountValue == null ? "" : String(toNumber(item.discountValue)),
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
              Editar
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
              Eliminar
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
          <label className="space-y-1 text-sm">
            <span className="text-slate-700">Cantidad</span>
            <Input
              type="number"
              min={1}
              value={draft.quantity}
              onChange={(event) => setDraft((current) => ({ ...current, quantity: event.target.value }))}
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-700">Precio de venta por unidad</span>
            <Input
              type="number"
              min={0}
              step="0.01"
              className="no-number-spinner"
              value={draft.unitSalePrice}
              onChange={(event) =>
                setDraft((current) => ({ ...current, unitSalePrice: event.target.value }))
              }
            />
          </label>
          <div className="space-y-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            <p className="text-slate-700">Costo por unidad (referencia)</p>
            <p className="font-medium text-slate-900">{formatMoney(item.unitCostSnapshot, currency)}</p>
          </div>
          <label className="space-y-1 text-sm">
            <span className="text-slate-700">Tipo de descuento</span>
            <select
              value={draft.discountType}
              onChange={(event) => setDraft((current) => ({ ...current, discountType: event.target.value }))}
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
            >
              <option value="">Sin descuento</option>
              {discountOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-700">Descuento</span>
            <Input
              type="number"
              min={0}
              step="0.01"
              className="no-number-spinner"
              value={draft.discountValue}
              onChange={(event) =>
                setDraft((current) => ({ ...current, discountValue: event.target.value }))
              }
              disabled={!draft.discountType}
            />
          </label>
          <div className="space-y-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            <p className="text-slate-700">Resumen de línea</p>
            <p className="font-medium text-slate-900">{formatMoney(item.lineRevenue, currency)}</p>
          </div>
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancelEdit} disabled={isSaving}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              onSave({
                quantity: Number(draft.quantity),
                unitSalePrice: Number(draft.unitSalePrice),
                discountType: (draft.discountType as InternalDiscountType) || undefined,
                discountValue: draft.discountValue.trim() ? Number(draft.discountValue) : undefined,
              }).catch(() => {
                // Errors are handled in hook state.
              });
            }}
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Guardar artículo"}
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
