import { StatCard } from "./stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Contract } from "@/lib/api-client";
import { formatCurrency, truncateAddress, blockchainUrl } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface InsurerDashboardProps {
  totalPremiums: number;
  totalCommissions: number;
  totalSettled: number;
  recentSettlements: Contract[];
}

export function InsurerDashboard({
  totalPremiums,
  totalCommissions,
  totalSettled,
  recentSettlements,
}: InsurerDashboardProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Premiums" value={`$${totalPremiums.toLocaleString()}`} />
        <StatCard title="Commissions Owed" value={`$${totalCommissions.toLocaleString()}`} />
        <StatCard title="Settled" value={`$${totalSettled.toLocaleString()}`} />
        <StatCard title="Outstanding" value={`$${(totalPremiums - totalSettled).toLocaleString()}`} />
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
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{c.productName}</span>
                  <div className="flex items-center gap-3">
                    <span>{formatCurrency(c.settlementAmount ?? 0, "USD")}</span>
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
