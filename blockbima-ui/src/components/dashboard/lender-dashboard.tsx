import Link from "next/link";
import { StatCard } from "./stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Contract } from "@/lib/api-client";
import { formatDate, statusLabel, statusVariant, formatCurrency } from "@/lib/utils";

interface LenderDashboardProps {
  totalContracts: number;
  totalBeneficiaries: number;
  premiumsCollected: number;
  premiumsOwed: number;
  recentContracts: Contract[];
}

export function LenderDashboard({
  totalContracts,
  totalBeneficiaries,
  premiumsCollected,
  premiumsOwed,
  recentContracts,
}: LenderDashboardProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Contracts" value={totalContracts.toLocaleString()} />
        <StatCard title="Beneficiaries" value={totalBeneficiaries.toLocaleString()} />
        <StatCard title="Premiums Collected" value={`$${premiumsCollected.toLocaleString()}`} />
        <StatCard title="Premiums Owed" value={`$${premiumsOwed.toLocaleString()}`} />
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Recent Contracts</CardTitle>
          <Link href="/contracts" className="text-xs text-primary underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentContracts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No contracts yet.</p>
          ) : (
            <div className="space-y-2">
              {recentContracts.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between text-sm">
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
