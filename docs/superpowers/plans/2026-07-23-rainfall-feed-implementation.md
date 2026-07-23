# Rainfall Feed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add transparent daily rainfall data visualization to each smart contract — sparkline in contract detail, full dashboard page with interactive chart, summary stats, and exportable table.

**Architecture:** Mock data layer (`rainfall-mock.ts`) with clean interface for future API swap. Recharts bar chart with threshold reference line. Dedicated `/contracts/[id]/rainfall` page.

**Tech Stack:** recharts (BarChart + ReferenceLine), existing shadcn/ui, existing CSV export utility

---

## File Structure

### New Files
```
src/
├── lib/rainfall-mock.ts                          # Mock data layer
├── components/contracts/rainfall-sparkline.tsx    # Mini chart for contract detail
└── app/contracts/[id]/rainfall/page.tsx           # Full rainfall dashboard
```

### Modified Files
```
src/lib/api-client.ts                             # Add DailyRainfall type
src/components/contracts/contract-detail.tsx       # Add RainfallSparkline card
src/app/contracts/[id]/page.tsx                    # Fetch threshold + rainfall
tests/auth.spec.ts                                 # Add rainfall route to protected
tests/config.spec.ts                               # Add rainfall page to checks
```

---

### Task 1: DailyRainfall Type + Mock Data Layer

**Files:**
- Modify: `src/lib/api-client.ts`
- Create: `src/lib/rainfall-mock.ts`

- [ ] **Step 1: Add DailyRainfall type to api-client.ts**

Add after the `Region` interface (around line 57):

```typescript
export interface DailyRainfall {
  date: string;
  amountMm: number;
}
```

- [ ] **Step 2: Create rainfall-mock.ts**

Create `src/lib/rainfall-mock.ts`:

```typescript
import { DailyRainfall } from "./api-client";

function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return () => {
    hash = (hash * 1664525 + 1013904223) | 0;
    return (hash >>> 0) / 4294967296;
  };
}

export async function getRainfallFeed(
  contractId: string,
  startDate: string,
  endDate: string
): Promise<DailyRainfall[]> {
  const readings: DailyRainfall[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) return readings;

  const rng = seededRandom(contractId);

  const current = new Date(start);
  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0];
    const rand = rng();
    let amount: number;

    if (rand < 0.18) {
      amount = 10 + rng() * 15;
    } else if (rand < 0.5) {
      amount = rng() * 8;
    } else {
      amount = 0;
    }

    readings.push({
      date: dateStr,
      amountMm: Math.round(amount * 10) / 10,
    });

    current.setDate(current.getDate() + 1);
  }

  return readings;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/api-client.ts src/lib/rainfall-mock.ts
git commit -m "feat: DailyRainfall type and mock data layer for rainfall feed"
```

---

### Task 2: Rainfall Sparkline Component

**Files:**
- Create: `src/components/contracts/rainfall-sparkline.tsx`

- [ ] **Step 1: Create the sparkline component**

Create `src/components/contracts/rainfall-sparkline.tsx`:

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/contracts/rainfall-sparkline.tsx
git commit -m "feat: rainfall sparkline component for contract detail"
```

---

### Task 3: Integrate Sparkline into Contract Detail

**Files:**
- Modify: `src/components/contracts/contract-detail.tsx`
- Modify: `src/app/contracts/[id]/page.tsx`

- [ ] **Step 1: Update contract-detail.tsx**

Add imports at the top (after existing imports):
```tsx
import { RainfallSparkline } from "./rainfall-sparkline";
import { DailyRainfall } from "@/lib/api-client";
```

Add to `ContractDetailProps` interface:
```tsx
threshold?: number;
rainfallReadings?: DailyRainfall[];
```

Add to destructured props:
```tsx
threshold,
rainfallReadings = [],
```

After the blockchain card (after the `</div>` closing the grid), add the sparkline:
```tsx
{rainfallReadings.length > 0 && threshold !== undefined && (
  <RainfallSparkline
    readings={rainfallReadings}
    threshold={threshold}
    contractId={contract.id}
  />
)}
```

- [ ] **Step 2: Update contracts/[id]/page.tsx**

Add import:
```tsx
import { getRainfallFeed } from "@/lib/rainfall-mock";
```

After fetching the contract and beneficiaries, add rainfall fetching:
```tsx
const rainfallReadings = contract.deployedAt
  ? await getRainfallFeed(
      contract.id,
      contract.deployedAt,
      contract.settledAt ?? new Date().toISOString().split("T")[0]
    )
  : [];

const region = await api.listRegions();
const regionData = region.data.find((r) => r.id === contract.regionId);
const threshold = regionData?.thresholds.find((t) => t.productId === contract.productId)?.thresholdValue;
```

Update the `ContractDetail` usage:
```tsx
<ContractDetail
  contract={contract}
  beneficiaries={beneficiaries}
  rainfallReadings={rainfallReadings}
  threshold={threshold}
/>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/contracts/contract-detail.tsx src/app/contracts/\[id\]/page.tsx
git commit -m "feat: integrate rainfall sparkline into contract detail page"
```

---

### Task 4: Full Rainfall Page

**Files:**
- Create: `src/app/contracts/[id]/rainfall/page.tsx`

- [ ] **Step 1: Create the full rainfall page**

Create `src/app/contracts/[id]/rainfall/page.tsx`:

```tsx
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireAuth, canAccess } from "@/lib/auth";
import { api, DailyRainfall } from "@/lib/api-client";
import { getRainfallFeed } from "@/lib/rainfall-mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CloudRain, TrendingUp, Calculator, Calendar } from "lucide-react";
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
            <ArrowLeft className="h-4 w-4" />
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
```

- [ ] **Step 2: Create rainfall-chart.tsx (interactive full-width chart)**

Create `src/app/contracts/[id]/rainfall/rainfall-chart.tsx`:

```tsx
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
            formatter={(value: number) => [`${value}mm`, "Rainfall"]}
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
```

- [ ] **Step 3: Create rainfall-table.tsx (readings table + CSV export)**

Create `src/app/contracts/[id]/rainfall/rainfall-table.tsx`:

```tsx
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DailyRainfall } from "@/lib/api-client";
import { Download } from "lucide-react";

interface RainfallTableProps {
  readings: DailyRainfall[];
  threshold: number;
}

export function RainfallTable({ readings, threshold }: RainfallTableProps) {
  const sorted = [...readings].sort((a, b) => b.date.localeCompare(a.date));

  const exportCSV = () => {
    const header = "Date,Rainfall (mm),Status,Variance from Threshold\n";
    const rows = sorted
      .map((r) => {
        const status = r.amountMm >= threshold ? "Above" : "Below";
        const variance = r.amountMm - threshold;
        return `${r.date},${r.amountMm},${status >= 0 ? "+" : ""}${variance.toFixed(1)}mm`;
      })
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rainfall-feed.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Rainfall (mm)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Variance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((r) => {
              const above = r.amountMm >= threshold;
              const variance = r.amountMm - threshold;
              return (
                <TableRow
                  key={r.date}
                  className={above ? "border-l-2 border-l-amber-500" : ""}
                >
                  <TableCell className="font-mono text-xs">{r.date}</TableCell>
                  <TableCell className="text-right font-medium">{r.amountMm}</TableCell>
                  <TableCell>
                    <Badge variant={above ? "destructive" : "secondary"} className="text-xs">
                      {above ? "⚠ Above" : "✓ Below"}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right text-xs ${above ? "text-amber-600" : "text-muted-foreground"}`}>
                    {variance >= 0 ? "+" : ""}{variance.toFixed(1)}mm
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/contracts/\[id\]/rainfall/
git commit -m "feat: full rainfall dashboard page with chart, stats, table, CSV export"
```

---

### Task 5: Update Tests

**Files:**
- Modify: `tests/auth.spec.ts`
- Modify: `tests/config.spec.ts`

- [ ] **Step 1: Add rainfall route to auth.spec.ts protected routes**

In `tests/auth.spec.ts`, add to `PROTECTED_ROUTES` array:
```typescript
"/contracts/some-id/rainfall",
```

Also add to the `routes` array inside the "all protected routes redirect" test.

- [ ] **Step 2: Add rainfall page to config.spec.ts file checks**

In `tests/config.spec.ts`, add to the required files list:
```typescript
"src/lib/rainfall-mock.ts",
"src/components/contracts/rainfall-sparkline.tsx",
"src/app/contracts/[id]/rainfall/page.tsx",
```

- [ ] **Step 3: Commit**

```bash
git add tests/
git commit -m "test: add rainfall feed to auth and config tests"
```

---

### Task 6: Build and Verify

- [ ] **Step 1: TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

- [ ] **Step 2: Production build**

```bash
npx next build 2>&1
```

- [ ] **Step 3: Playwright tests**

```bash
npx playwright test --reporter=list 2>&1
```

- [ ] **Step 4: Fix any failures and commit**

```bash
git add -A && git commit -m "fix: resolve issues after rainfall feed implementation"
```

---

## Summary

| Task | Files Created | Files Modified |
|------|--------------|----------------|
| 1 | `rainfall-mock.ts` | `api-client.ts` |
| 2 | `rainfall-sparkline.tsx` | — |
| 3 | — | `contract-detail.tsx`, `[id]/page.tsx` |
| 4 | `rainfall/page.tsx`, `rainfall-chart.tsx`, `rainfall-table.tsx` | — |
| 5 | — | `auth.spec.ts`, `config.spec.ts` |
| 6 | — | — |
