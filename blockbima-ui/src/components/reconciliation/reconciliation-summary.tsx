import { StatCard } from "@/components/dashboard/stat-card";
import { SettlementBar } from "@/components/charts/settlement-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Contract } from "@/lib/api-client";

interface ReconciliationSummaryProps {
  totalCollected: number;
  totalOwed: number;
  outstanding: number;
  contracts?: Contract[];
}

export function ReconciliationSummary({ totalCollected, totalOwed, outstanding, contracts = [] }: ReconciliationSummaryProps) {
  const regionData = Object.entries(
    contracts.reduce((acc, c) => {
      if (!acc[c.productName]) acc[c.productName] = { premiums: 0, settled: 0 };
      acc[c.productName].premiums += c.totalPremium;
      if (c.status === "CONTRACT_STATUS_SETTLED") acc[c.productName].settled += c.settlementAmount ?? 0;
      return acc;
    }, {} as Record<string, { premiums: number; settled: number }>)
  ).map(([name, data]) => ({ name, ...data }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Premiums Collected" value={`$${totalCollected.toLocaleString()}`} />
        <StatCard title="Owed to Insurer" value={`$${totalOwed.toLocaleString()}`} />
        <StatCard
          title="Outstanding"
          value={`$${outstanding.toLocaleString()}`}
          description={outstanding > 0 ? "Amount remaining" : "All settled"}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Settlement Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {regionData.length > 0 ? (
            <SettlementBar data={regionData} />
          ) : (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              No contract data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
