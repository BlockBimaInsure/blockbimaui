"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface StatusDonutProps {
  data: { name: string; value: number; color: string }[];
  title?: string;
}

export function StatusDonut({ data, title }: StatusDonutProps) {
  if (data.every((d) => d.value === 0)) {
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              fontSize: "12px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span className="text-xs text-muted-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
