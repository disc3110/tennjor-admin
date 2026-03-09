import { Card } from "@/src/components/ui/card";
import { formatMoney, formatPercent } from "@/src/features/sales/utils/format";
import type { SalesStatsData } from "@/src/features/sales/types/sale";

type SalesStatsPanelProps = {
  stats: SalesStatsData | null;
  isLoading: boolean;
  error: string | null;
  currency: string;
};

export function SalesStatsPanel({ stats, isLoading, error, currency }: SalesStatsPanelProps) {
  if (isLoading) {
    return <Card className="h-40 animate-pulse bg-slate-100" />;
  }

  if (error) {
    return (
      <Card>
        <p className="text-sm font-medium text-red-600">{error}</p>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <p className="text-sm text-slate-500">No stats available.</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Sales Stats</h2>

      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="Sales Count" value={String(stats.salesCount)} />
        <MetricCard label="Revenue" value={formatMoney(stats.totalRevenue, currency)} />
        <MetricCard label="Cost" value={formatMoney(stats.totalCost, currency)} />
        <MetricCard label="Profit" value={formatMoney(stats.totalProfit, currency)} />
        <MetricCard label="Avg Margin" value={formatPercent(stats.averageMarginPct)} />
        <MetricCard label="Avg Ticket" value={formatMoney(stats.averageTicket, currency)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-slate-800">Top Selling Products</p>
          <ul className="mt-2 space-y-2">
            {stats.topSellingProducts.length === 0 ? (
              <li className="text-sm text-slate-500">No data for this period.</li>
            ) : (
              stats.topSellingProducts.map((product) => (
                <li key={`sell-${product.productId}`} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <p className="font-medium text-slate-900">{product.productName}</p>
                  <p className="text-slate-500">Qty: {product.totalQuantity}</p>
                  <p className="text-slate-500">Revenue: {formatMoney(product.totalRevenue, currency)}</p>
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">Top Profitable Products</p>
          <ul className="mt-2 space-y-2">
            {stats.topProfitableProducts.length === 0 ? (
              <li className="text-sm text-slate-500">No data for this period.</li>
            ) : (
              stats.topProfitableProducts.map((product) => (
                <li key={`profit-${product.productId}`} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <p className="font-medium text-slate-900">{product.productName}</p>
                  <p className="text-slate-500">Profit: {formatMoney(product.totalProfit, currency)}</p>
                  <p className="text-slate-500">Qty: {product.totalQuantity}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </Card>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
};

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
