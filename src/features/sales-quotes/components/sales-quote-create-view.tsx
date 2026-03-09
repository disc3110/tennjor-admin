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
        Back to sales quotes
      </Link>

      <PageHeader
        title="Create Sales Quote"
        subtitle="Start a draft internal quote and refine it with line items."
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
            <span className="text-sm font-medium text-slate-700">Customer Name</span>
            <Input name="customerName" required placeholder="Customer name" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Currency</span>
            <Input name="currency" defaultValue="MXN" placeholder="MXN" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Customer Phone</span>
            <Input name="customerPhone" placeholder="+52..." />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Customer Email</span>
            <Input name="customerEmail" type="email" placeholder="customer@email.com" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Customer City</span>
            <Input name="customerCity" placeholder="Monterrey" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Public Quote Request ID (Optional)</span>
            <Input name="publicQuoteRequestId" placeholder="quote-request-id" />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Notes</span>
            <textarea
              name="notes"
              className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              placeholder="Internal context or customer requirements"
            />
          </label>

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Creating..." : "Create Sales Quote"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
