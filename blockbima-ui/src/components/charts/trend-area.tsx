"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TrendAreaProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  color?: string;
  title?: string;
  formatValue?: (v: number) => string;
}

export function TrendArea({ data, xKey, yKey, color = "oklch(0.60 0.17 170)", title, formatValue }: TrendAreaProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
        No data yet
      </div>
    );
  }

  return (
    <div>
      {title && <p className="mb-2 text-sm font-medium text-muted-foreground">{title}</p>}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
          <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              fontSize: "12px",
            }}
            formatter={formatValue ? [(v: number) => formatValue(v)] : undefined}
          />
          <Area type="monotone" dataKey={yKey} stroke={color} fillOpacity={1} fill="url(#colorY)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
