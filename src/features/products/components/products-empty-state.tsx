import { Card } from "@/src/components/ui/card";

export function ProductsEmptyState() {
  return (
    <Card className="py-14 text-center">
      <h2 className="text-lg font-semibold text-slate-900">No se encontraron productos</h2>
      <p className="mt-2 text-sm text-slate-500">
        Prueba ajustando los filtros o la búsqueda.
      </p>
    </Card>
  );
}
