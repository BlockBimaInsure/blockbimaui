"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface SettlementBarProps {
  data: { name: string; premiums: number; settled: number }[];
  title?: string;
}

export function SettlementBar({ data, title }: SettlementBarProps) {
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
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
          <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              fontSize: "12px",
            }}
          />
          <Legend iconType="circle" iconSize={8} />
          <Bar dataKey="premiums" fill="oklch(0.60 0.17 170)" radius={[4, 4, 0, 0]} name="Premiums" />
          <Bar dataKey="settled" fill="oklch(0.65 0.19 145)" radius={[4, 4, 0, 0]} name="Settled" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
