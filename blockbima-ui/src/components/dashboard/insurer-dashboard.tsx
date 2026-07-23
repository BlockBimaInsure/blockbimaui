import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "./stat-card";
import { StatusDonut } from "@/components/charts/status-donut";
import { SettlementBar } from "@/components/charts/settlement-bar";
import { Contract } from "@/lib/api-client";
import { formatCurrency, truncateAddress, blockchainUrl, statusLabel, statusVariant, formatDate } from "@/lib/utils";
import { DollarSign, TrendingDown, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";

interface InsurerDashboardProps {
  totalPremiums: number;
  totalCommissions: number;
  totalSettled: number;
  recentSettlements: Contract[];
  contracts: Contract[];
}

export function InsurerDashboard({
  totalPremiums,
  totalCommissions,
  totalSettled,
  recentSettlements,
  contracts,
}: InsurerDashboardProps) {
  const outstanding = totalPremiums - totalSettled;

  const statusData = [
    { name: "Created", value: contracts.filter((c) => c.status === "CONTRACT_STATUS_CREATED").length, color: "oklch(0.72 0.19 55)" },
    { name: "Deployed", value: contracts.filter((c) => c.status === "CONTRACT_STATUS_DEPLOYED").length, color: "oklch(0.60 0.17 170)" },
    { name: "Settled", value: contracts.filter((c) => c.status === "CONTRACT_STATUS_SETTLED").length, color: "oklch(0.65 0.19 145)" },
  ];

  const regionData = Object.entries(
    contracts.reduce((acc, c) => {
      if (!acc[c.regionName]) acc[c.regionName] = { premiums: 0, settled: 0 };
      acc[c.regionName].premiums += c.totalPremium;
      if (c.status === "CONTRACT_STATUS_SETTLED") acc[c.regionName].settled += c.settlementAmount ?? 0;
      return acc;
    }, {} as Record<string, { premiums: number; settled: number }>)
  ).map(([name, data]) => ({ name, ...data }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settlement Monitor</h1>
        <p className="text-sm text-muted-foreground">Track premiums, commissions, and blockchain settlements</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Premiums"
          value={formatCurrency(totalPremiums, "USD")}
          icon={DollarSign}
          accentColor="oklch(0.60 0.17 170)"
        />
        <StatCard
          title="Commissions Owed"
          value={formatCurrency(totalCommissions, "USD")}
          icon={TrendingDown}
          accentColor="oklch(0.72 0.19 55)"
        />
        <StatCard
          title="Settled"
          value={formatCurrency(totalSettled, "USD")}
          icon={CheckCircle2}
          accentColor="oklch(0.65 0.19 145)"
        />
        <StatCard
          title="Outstanding"
          value={formatCurrency(outstanding, "USD")}
          icon={AlertTriangle}
          accentColor={outstanding > 0 ? "oklch(0.72 0.19 55)" : "oklch(0.65 0.19 145)"}
          description={outstanding > 0 ? `${((outstanding / totalPremiums) * 100).toFixed(0)}% of total` : "All settled"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Premiums vs Settlements by Region</CardTitle>
          </CardHeader>
          <CardContent>
            <SettlementBar data={regionData} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <StatusDonut data={statusData} title="Contract Status" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent Settlements</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSettlements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No settlements yet.</p>
          ) : (
            <div className="space-y-2">
              {recentSettlements.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <div>
                      <span className="font-medium">{c.productName}</span>
                      <span className="ml-2 text-muted-foreground">{formatDate(c.settledAt ?? "")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs font-mono">
                      {formatCurrency(c.settlementAmount ?? 0, "USD")}
                    </Badge>
                    {c.settlementTransactionId && (
                      <a
                        href={blockchainUrl("tx", c.settlementTransactionId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        {truncateAddress(c.settlementTransactionId, 6)}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
