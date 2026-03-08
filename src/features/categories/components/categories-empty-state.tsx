import { Card } from "@/src/components/ui/card";

export function CategoriesEmptyState() {
  return (
    <Card className="py-14 text-center">
      <h2 className="text-lg font-semibold text-slate-900">No categories found</h2>
      <p className="mt-2 text-sm text-slate-500">
        Try adjusting your filters or search query.
      </p>
    </Card>
  );
}
