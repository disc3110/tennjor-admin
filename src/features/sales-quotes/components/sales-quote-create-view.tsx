"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { PageHeader } from "@/src/components/ui/page-header";
import { useSalesQuoteCreate } from "@/src/features/sales-quotes/hooks/use-sales-quote-create";

export function SalesQuoteCreateView() {
  const router = useRouter();
  const { isSaving, error, successMessage, createQuote } = useSalesQuoteCreate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      customerName: String(formData.get("customerName") ?? "").trim(),
      customerPhone: String(formData.get("customerPhone") ?? "").trim() || undefined,
      customerEmail: String(formData.get("customerEmail") ?? "").trim() || undefined,
      customerCity: String(formData.get("customerCity") ?? "").trim() || undefined,
      notes: String(formData.get("notes") ?? "").trim() || undefined,
      currency: String(formData.get("currency") ?? "").trim() || undefined,
      publicQuoteRequestId:
        String(formData.get("publicQuoteRequestId") ?? "").trim() || undefined,
    };

    const quote = await createQuote(payload);
    if (quote) {
      router.replace(`/admin/sales-quotes/${quote.id}`);
    }
  };

  return (
    <section className="space-y-6">
      <Link
        href="/admin/sales-quotes"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="size-4" />
        Volver a cotizaciones de venta
      </Link>

      <PageHeader
        title="Crear cotización de venta"
        subtitle="Inicia una cotización interna en borrador y ajústala con líneas."
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

      <Card>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(event) => {
            handleSubmit(event).catch(() => {
              // Errors are handled in hook state.
            });
          }}
        >
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Nombre del cliente</span>
            <Input name="customerName" required placeholder="Nombre del cliente" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Moneda</span>
            <Input name="currency" defaultValue="MXN" placeholder="MXN" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Teléfono del cliente</span>
            <Input name="customerPhone" placeholder="+52..." />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Correo del cliente</span>
            <Input name="customerEmail" type="email" placeholder="correo@ejemplo.com" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Ciudad del cliente</span>
            <Input name="customerCity" placeholder="Monterrey" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">ID de solicitud pública (opcional)</span>
            <Input name="publicQuoteRequestId" placeholder="id-solicitud-cotizacion" />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Notas</span>
            <textarea
              name="notes"
              className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              placeholder="Contexto interno o requisitos del cliente"
            />
          </label>

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Creando..." : "Crear cotización de venta"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
