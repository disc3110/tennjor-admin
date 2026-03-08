import { Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { PageHeader } from "@/src/components/ui/page-header";

export function ProductsView() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Products"
        subtitle="Manage your product catalog, pricing, and inventory visibility."
        action={
          <Button iconLeft={<Plus className="size-4" />} className="w-full md:w-auto">
            Add Product
          </Button>
        }
      />

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Catalog Management</h2>
        <p className="mt-2 text-sm text-slate-500">
          Product listing, filtering, and editing tools will be connected to the backend API
          in the next phase.
        </p>
      </Card>
    </section>
  );
}
