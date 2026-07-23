"use client";

import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyRainfall } from "@/lib/api-client";
import { ArrowRight } from "lucide-react";

interface RainfallSparklineProps {
  readings: DailyRainfall[];
  threshold: number;
  contractId: string;
}

export function RainfallSparkline({ readings, threshold, contractId }: RainfallSparklineProps) {
  if (readings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Rainfall Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No rainfall data available for this period.</p>
        </CardContent>
      </Card>
    );
  }

  const daysAbove = readings.filter((r) => r.amountMm >= threshold).length;
  const peak = readings.reduce((max, r) => (r.amountMm > max.amountMm ? r : max), readings[0]);
  const total = readings.reduce((sum, r) => sum + r.amountMm, 0);

  const chartData = readings.map((r) => ({
    date: r.date.slice(5),
    amountMm: r.amountMm,
    fill: r.amountMm >= threshold ? "oklch(0.72 0.19 55)" : "oklch(0.60 0.17 170)",
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Rainfall Monitor</CardTitle>
        <Link
          href={`/contracts/${contractId}/rainfall`}
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          View Full Feed <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
                interval={Math.max(0, Math.floor(readings.length / 8) - 1)}
              />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} width={30} />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value}mm`, "Rainfall"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <ReferenceLine
                y={threshold}
                stroke="oklch(0.72 0.19 55)"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Threshold: ${threshold}mm`,
                  position: "insideTopRight",
                  fill: "oklch(0.72 0.19 55)",
                  fontSize: 10,
                }}
              />
              <Bar dataKey="amountMm" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <span>
            <span className="font-medium text-foreground">{daysAbove}</span> of {readings.length} days above threshold
          </span>
          <span>
            Peak: <span className="font-medium text-foreground">{peak.amountMm}mm</span> on {peak.date}
          </span>
          <span>
            Total: <span className="font-medium text-foreground">{total.toFixed(1)}mm</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
