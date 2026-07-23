import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireAuth, canAccess } from "@/lib/auth";
import { api } from "@/lib/api-client";
import { getRainfallFeed } from "@/lib/rainfall-mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { CloudRain, TrendingUp, Calculator, Calendar } from "lucide-react";
import { RainfallChart } from "./rainfall-chart";
import { RainfallTable } from "./rainfall-table";

export default async function RainfallPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth();
  if (!canAccess(user, "contracts")) redirect("/access-denied");
  const { id } = await params;

  try {
    const contract = await api.getContract(id);
    const regionRes = await api.listRegions();
    const region = regionRes.data.find((r) => r.id === contract.regionId);
    const threshold = region?.thresholds.find((t) => t.productId === contract.productId)?.thresholdValue ?? 0;

    const startDate = contract.deployedAt ?? contract.createdAt;
    const endDate = contract.settledAt ?? new Date().toISOString().split("T")[0];

    const readings = await getRainfallFeed(contract.id, startDate, endDate);

    const daysAbove = readings.filter((r) => r.amountMm >= threshold).length;
    const peak = readings.length > 0
      ? readings.reduce((max, r) => (r.amountMm > max.amountMm ? r : max), readings[0])
      : null;
    const avg = readings.length > 0
      ? readings.reduce((sum, r) => sum + r.amountMm, 0) / readings.length
      : 0;

    const daysRemaining = contract.settled
      ? null
      : Math.max(0, Math.ceil((new Date(contract.maturityDate).getTime() - Date.now()) / 86400000));

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/contracts/${contract.id}`}
            className="rounded-lg border p-2 text-muted-foreground hover:bg-muted"
          >
            ← Back
          </Link>
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/contracts" className="hover:underline">Contracts</Link>
              <span>/</span>
              <span>{contract.productName}</span>
              <span>/</span>
              <span className="text-foreground">Rainfall Feed</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Rainfall Feed — {contract.productName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {contract.regionName} · {startDate} to {endDate}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Days Above Threshold"
            value={`${daysAbove} of ${readings.length}`}
            icon={CloudRain}
            accentColor={daysAbove > 0 ? "oklch(0.72 0.19 55)" : "oklch(0.65 0.19 145)"}
          />
          <StatCard
            title="Peak Rainfall"
            value={peak ? `${peak.amountMm}mm` : "—"}
            description={peak ? `on ${peak.date}` : undefined}
            icon={TrendingUp}
            accentColor="oklch(0.60 0.22 25)"
          />
          <StatCard
            title="Average Daily"
            value={`${avg.toFixed(1)}mm`}
            icon={Calculator}
            accentColor="oklch(0.60 0.17 170)"
          />
          <StatCard
            title={contract.settledAt ? "Settled" : "Days Remaining"}
            value={contract.settledAt ? contract.settledAt.split("T")[0] : `${daysRemaining}`}
            icon={Calendar}
            accentColor="oklch(0.55 0.15 280)"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Daily Rainfall — Threshold: {threshold}mm</CardTitle>
          </CardHeader>
          <CardContent>
            <RainfallChart readings={readings} threshold={threshold} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Daily Readings</CardTitle>
            <RainfallTable readings={readings} threshold={threshold} />
          </CardHeader>
        </Card>
      </div>
    );
  } catch {
    notFound();
  }
}
