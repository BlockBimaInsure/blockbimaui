"use client";

import {
  BarChart, Bar, XAxis, YAxis, ReferenceLine,
  ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";
import { DailyRainfall } from "@/lib/api-client";

interface RainfallChartProps {
  readings: DailyRainfall[];
  threshold: number;
}

export function RainfallChart({ readings, threshold }: RainfallChartProps) {
  const chartData = readings.map((r) => ({
    date: r.date.slice(5),
    amountMm: r.amountMm,
  }));

  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            interval={Math.max(0, Math.floor(readings.length / 12) - 1)}
          />
          <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} width={40} />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              fontSize: "12px",
            }}
            formatter={(value) => [`${value}mm`, "Rainfall"]}
            labelFormatter={(label) => `Date: 2026-${label}`}
          />
          <ReferenceLine
            y={threshold}
            stroke="oklch(0.72 0.19 55)"
            strokeDasharray="6 3"
            strokeWidth={2}
            label={{
              value: `Threshold ${threshold}mm`,
              position: "insideTopRight",
              fill: "oklch(0.72 0.19 55)",
              fontSize: 11,
              fontWeight: 600,
            }}
          />
          <Bar
            dataKey="amountMm"
            radius={[3, 3, 0, 0]}
            fill="oklch(0.60 0.17 170)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
