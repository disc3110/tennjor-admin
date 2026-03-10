import { Card } from "@/src/components/ui/card";

export function QuotesEmptyState() {
  return (
    <Card className="py-14 text-center">
      <h2 className="text-lg font-semibold text-slate-900">No se encontraron cotizaciones</h2>
      <p className="mt-2 text-sm text-slate-500">
        Las solicitudes de cotización aparecerán aquí cuando los clientes las envíen.
      </p>
    </Card>
  );
}
