import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { CategoryStatusBadge } from "@/src/features/categories/components/category-status-badge";
import type { CategoryAdmin } from "@/src/features/categories/types/category";

type CategoriesTableProps = {
  categories: CategoryAdmin[];
  isUpdating: string | null;
  onToggleStatus: (category: CategoryAdmin) => void;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

export function CategoriesTable({
  categories,
  isUpdating,
  onToggleStatus,
}: CategoriesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Slug</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Products</th>
            <th className="px-4 py-3">Updated</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {categories.map((category) => (
            <tr key={category.id} className="align-top">
              <td className="px-4 py-4 text-sm font-semibold text-slate-900">{category.name}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{category.slug}</td>
              <td className="px-4 py-4">
                <CategoryStatusBadge isActive={category.isActive} />
              </td>
              <td className="px-4 py-4 text-sm text-slate-700">{category._count.products}</td>
              <td className="px-4 py-4 text-sm text-slate-700">{formatDate(category.updatedAt)}</td>
              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    Edit
                  </Link>
                  <Button
                    variant="secondary"
                    disabled={isUpdating === category.id}
                    onClick={() => onToggleStatus(category)}
                  >
                    {category.isActive ? "Deactivate" : "Activate"}
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
