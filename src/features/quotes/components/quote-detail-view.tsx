"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { PageHeader } from "@/src/components/ui/page-header";
import { QuoteQuickActionsCard } from "@/src/features/quotes/components/quote-quick-actions-card";
import { QuoteStatusBadge } from "@/src/features/quotes/components/quote-status-badge";
import { useQuoteDetail } from "@/src/features/quotes/hooks/use-quote-detail";
import type { QuoteRequestStatus } from "@/src/features/quotes/types/quote";

type QuoteDetailViewProps = {
  quoteId: string;
};

const statusOptions: QuoteRequestStatus[] = ["NEW", "CONTACTED", "QUOTED", "CLOSED", "REJECTED"];

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

export function QuoteDetailView({ quoteId }: QuoteDetailViewProps) {
  const { quote, isLoading, isSaving, error, successMessage, saveStatusAndNote } =
    useQuoteDetail(quoteId);
  const [statusDraft, setStatusDraft] = useState<QuoteRequestStatus | null>(null);
  const [note, setNote] = useState("");

  const handleSave = async () => {
    if (!quote) return;

    const status = statusDraft ?? quote.status;
    const payload =
      note.trim().length > 0
        ? { status, internalNotes: note.trim() }
        : { status };

    await saveStatusAndNote(payload);
    setNote("");
    setStatusDraft(null);
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <PageHeader title="Detalle de cotización" subtitle="Cargando información de la cotización..." />
        <Card className="h-48 animate-pulse bg-slate-100" />
      </section>
    );
  }

  if (!quote) {
    return (
      <Card className="py-14 text-center">
        <h2 className="text-lg font-semibold text-slate-900">Cotización no encontrada</h2>
        <p className="mt-2 text-sm text-slate-500">
          Es posible que la cotización haya sido eliminada o no esté disponible.
        </p>
      </Card>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/quotes"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Volver a cotizaciones
        </Link>
      </div>

      <PageHeader
        title={`Cotización ${quote.id}`}
        subtitle={`Recibida el ${formatDate(quote.createdAt)}`}
        action={<QuoteStatusBadge status={quote.status} />}
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
        <Card className="space-y-4 xl:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">Artículos de la cotización</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2">Producto</th>
                  <th className="px-3 py-2">Slug</th>
                  <th className="px-3 py-2">Talla</th>
                  <th className="px-3 py-2">Color</th>
                  <th className="px-3 py-2">Cant.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quote.items.map((item) => (
                  <tr key={item.id} className="text-sm text-slate-700">
                    <td className="px-3 py-3">{item.productNameSnapshot}</td>
                    <td className="px-3 py-3">{item.productSlugSnapshot}</td>
                    <td className="px-3 py-3">{item.size}</td>
                    <td className="px-3 py-3">{item.color}</td>
                    <td className="px-3 py-3">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Información del cliente</h2>
            <div className="space-y-1 text-sm text-slate-700">
              <p>
                <span className="font-medium">Nombre:</span> {quote.customerName}
              </p>
              <p>
                <span className="font-medium">Correo:</span> {quote.customerEmail}
              </p>
              <p>
                <span className="font-medium">Teléfono:</span> {quote.customerPhone}
              </p>
              <p>
                <span className="font-medium">Ciudad:</span> {quote.customerCity}
              </p>
            </div>
            {quote.notes ? (
              <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                <p className="font-medium text-slate-900">Notas del cliente</p>
                <p className="mt-1">{quote.notes}</p>
              </div>
            ) : null}
          </Card>

          <QuoteQuickActionsCard quote={quote} />

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Estado y notas internas</h2>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Estado</span>
              <select
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                value={statusDraft ?? quote.status}
                onChange={(event) => setStatusDraft(event.target.value as QuoteRequestStatus)}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Agregar nota interna</span>
              <textarea
                className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Escribe una actualización interna (opcional)"
              />
            </label>

            <Button className="w-full" disabled={isSaving} onClick={() => void handleSave()}>
              {isSaving ? "Guardando..." : "Guardar actualización"}
            </Button>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Notas internas</p>
              {quote.internalNotes.length === 0 ? (
                <p className="text-sm text-slate-500">Aún no hay notas internas.</p>
              ) : (
                <ul className="space-y-2">
                  {quote.internalNotes.map((internalNote, index) => (
                    <li key={`${internalNote}-${index}`} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                      {internalNote}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
