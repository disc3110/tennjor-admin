import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { PageHeader } from "@/src/components/ui/page-header";

type ProductEditPlaceholderViewProps = {
  productId: string;
};

export function ProductEditPlaceholderView({ productId }: ProductEditPlaceholderViewProps) {
  return (
    <section className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="size-4" />
        Back to products
      </Link>

      <PageHeader
        title={`Edit Product ${productId}`}
        subtitle="Product edit form will be implemented in the next step."
      />

      <Card>
        <p className="text-sm text-slate-600">
          This placeholder route confirms navigation and route structure for product-specific
          editing.
        </p>
      </Card>
    </section>
  );
}
