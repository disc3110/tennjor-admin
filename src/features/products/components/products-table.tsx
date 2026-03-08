import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ProductStatusBadge } from "@/src/features/products/components/product-status-badge";
import type { ProductAdmin } from "@/src/features/products/types/product";

type ProductsTableProps = {
  products: ProductAdmin[];
  isUpdating: string | null;
  onToggleStatus: (product: ProductAdmin) => void;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

function getStockSummary(product: ProductAdmin) {
  const activeVariants = product.variants.filter((variant) => variant.isActive).length;
  const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);

  return `${activeVariants}/${product.variants.length} active variants • ${totalStock} stock`;
}

export function ProductsTable({ products, isUpdating, onToggleStatus }: ProductsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Variants / Stock</th>
            <th className="px-4 py-3">Updated</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {products.map((product) => (
            <tr key={product.id} className="align-top">
              <td className="px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                <p className="text-xs text-slate-500">{product.slug}</p>
              </td>
              <td className="px-4 py-4 text-sm text-slate-700">{product.category.name}</td>
              <td className="px-4 py-4">
                <ProductStatusBadge isActive={product.isActive} />
              </td>
              <td className="px-4 py-4 text-sm text-slate-700">{getStockSummary(product)}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{formatDate(product.updatedAt)}</td>
              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    Edit
                  </Link>
                  <Button
                    variant="secondary"
                    disabled={isUpdating === product.id}
                    onClick={() => onToggleStatus(product)}
                  >
                    {product.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
