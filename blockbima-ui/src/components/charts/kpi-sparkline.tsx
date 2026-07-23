"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface KPISparklineProps {
  data: number[];
  color?: string;
  className?: string;
}

export function KPISparkline({ data, color = "oklch(0.60 0.17 170)", className }: KPISparklineProps) {
  const chartData = data.map((value, i) => ({ i, value }));

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={40}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`spark-${color.replace(/[^a-z0-9]/g, "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#spark-${color.replace(/[^a-z0-9]/g, "")})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
