import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "./stat-card";
import { StatusDonut } from "@/components/charts/status-donut";
import { TrendArea } from "@/components/charts/trend-area";
import { BeneficiaryCluster } from "@/components/maps/beneficiary-cluster";
import { Contract, Beneficiary } from "@/lib/api-client";
import { formatDate, statusLabel, statusVariant, formatCurrency } from "@/lib/utils";
import { FileText, Users, DollarSign, AlertTriangle } from "lucide-react";

interface LenderDashboardProps {
  totalContracts: number;
  totalBeneficiaries: number;
  premiumsCollected: number;
  premiumsOwed: number;
  recentContracts: Contract[];
  contracts: Contract[];
  beneficiaries?: Beneficiary[];
}

export function LenderDashboard({
  totalContracts,
  totalBeneficiaries,
  premiumsCollected,
  premiumsOwed,
  recentContracts,
  contracts,
  beneficiaries = [],
}: LenderDashboardProps) {
  const statusData = [
    { name: "Created", value: contracts.filter((c) => c.status === "CONTRACT_STATUS_CREATED").length, color: "oklch(0.72 0.19 55)" },
    { name: "Deployed", value: contracts.filter((c) => c.status === "CONTRACT_STATUS_DEPLOYED").length, color: "oklch(0.60 0.17 170)" },
    { name: "Settled", value: contracts.filter((c) => c.status === "CONTRACT_STATUS_SETTLED").length, color: "oklch(0.65 0.19 145)" },
  ];

  const trendData = recentContracts.slice(-10).map((c) => ({
    date: formatDate(c.createdAt),
    premiums: c.totalPremium,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Portfolio Overview</h1>
        <p className="text-sm text-muted-foreground">Your insurance portfolio at a glance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Contracts"
          value={totalContracts.toLocaleString()}
          icon={FileText}
          accentColor="oklch(0.60 0.17 170)"
          trend={contracts.slice(-10).map(() => Math.random() * 10)}
        />
        <StatCard
          title="Beneficiaries"
          value={totalBeneficiaries.toLocaleString()}
          icon={Users}
          accentColor="oklch(0.65 0.19 145)"
        />
        <StatCard
          title="Premiums Collected"
          value={formatCurrency(premiumsCollected, "USD")}
          icon={DollarSign}
          accentColor="oklch(0.65 0.19 145)"
        />
        <StatCard
          title="Premiums Owed"
          value={formatCurrency(premiumsOwed, "USD")}
          icon={AlertTriangle}
          accentColor="oklch(0.72 0.19 55)"
          description={premiumsOwed > premiumsCollected ? "Outstanding balance" : "All current"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Beneficiary Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <BeneficiaryCluster beneficiaries={beneficiaries} className="h-[300px]" />
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
          <CardTitle className="text-sm">Premium Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendArea
            data={trendData}
            xKey="date"
            yKey="premiums"
            formatValue={(v) => `$${v.toLocaleString()}`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Recent Contracts</CardTitle>
          <Link href="/contracts" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentContracts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No contracts yet.</p>
          ) : (
            <div className="space-y-2">
              {recentContracts.slice(0, 5).map((c) => (
                <Link
                  key={c.id}
                  href={`/contracts/${c.id}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <span className="font-medium">{c.productName}</span>
                    <span className="ml-2 text-muted-foreground">in {c.regionName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant(c.status)} className="text-xs">
                      {statusLabel(c.status)}
                    </Badge>
                    <span className="text-muted-foreground">{formatDate(c.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
