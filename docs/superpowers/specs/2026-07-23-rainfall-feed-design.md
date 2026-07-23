# Rainfall Feed — Contract Transparency Feature

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide transparent, verifiable daily rainfall data for each smart contract, enabling stakeholders to check the veracity of triggered payouts against recorded rainfall.

**Architecture:** Mock data layer with a clean interface for future API swap. Sparkline in contract detail for at-a-glance view. Dedicated full-page rainfall dashboard with interactive chart, summary stats, and exportable data table.

**Tech Stack:** recharts (bar chart + threshold line), existing shadcn/ui components, existing CSV export utility, MapLibre (map on full page showing weather station location — future enhancement)

---

## Data Model

### New Type: DailyRainfall

```typescript
// src/lib/api-client.ts — add to existing types
export interface DailyRainfall {
  date: string;       // ISO date "2026-03-15"
  amountMm: number;   // Rainfall in millimeters
}
```

### Threshold Source

Uses existing `Region.thresholds[]` — each entry has `{ productId: string; thresholdValue: number }`. The threshold for a contract is matched by `contract.productId`.

### Mock Data Layer

**File:** `src/lib/rainfall-mock.ts`

**Interface:**
```typescript
export async function getRainfallFeed(
  contractId: string,
  startDate: string,
  endDate: string
): Promise<DailyRainfall[]>
```

**Behavior:**
- Returns one `DailyRainfall` entry per day from `startDate` to `endDate` (inclusive)
- Amounts generated deterministically using a seeded pseudo-random function based on `contractId + date`
- ~15-20% of days exceed a typical threshold (5-15mm range) to demonstrate breach visualization
- Most days: 0-8mm. Breach days: 10-25mm
- Returns empty array if `startDate` > `endDate`

**Swap path:** When real API is ready, replace the function body with:
```typescript
async function getRainfallFeed(contractId, startDate, endDate) {
  const response = await fetch(`${BLOCKBIMA_API_URL}/rainfall/v1/feed?contractId=${contractId}&start=${startDate}&end=${endDate}`);
  const data = await response.json();
  return data.readings; // { date: string, amountMm: number }[]
}
```

---

## Component: Rainfall Sparkline (Contract Detail)

**File:** `src/components/contracts/rainfall-sparkline.tsx`

**Props:**
```typescript
interface RainfallSparklineProps {
  readings: DailyRainfall[];
  threshold: number;
  contractId: string;
  productName: string;
  regionName: string;
}
```

**Layout:**
- Card with header "Rainfall Monitor" + "View Full Feed →" link
- Mini bar chart (recharts `BarChart`) — each bar = 1 day
- Color coding:
  - Below threshold: teal `oklch(0.60 0.17 170)`
  - At/above threshold: amber `oklch(0.72 0.19 55)`
- Horizontal reference line at threshold value (dashed, amber, labeled)
- Summary stats row below chart:
  - "X of Y days above threshold"
  - "Peak: XXmm on [date]"
  - "Total: XXmm"

**Integration:** Added to contract detail page (`src/components/contracts/contract-detail.tsx`) after the blockchain card.

---

## Component: Rainfall Full Page

**Route:** `src/app/contracts/[id]/rainfall/page.tsx`

**Layout:**
1. **Breadcrumb**: Contracts > [Product Name] > Rainfall Feed
2. **Back link** → `/contracts/[id]`
3. **Header**: "Rainfall Feed — [Product Name] in [Region Name]"
4. **Period badge**: date range

**Sections:**

### Full-width interactive bar chart
- Same color coding as sparkline
- Larger, responsive (fills container width)
- Tooltip on hover: exact date + mm value
- X-axis: dates (formatted "Mar 15")
- Y-axis: mm
- Threshold line: dashed amber, labeled with value

### Summary strip (4 stat cards)
- "Days Above Threshold" — count, amber accent
- "Peak Rainfall" — max mm + date, rose accent
- "Average Daily" — mean mm, teal accent
- "Days Remaining" — days to maturity (or "Settled on [date]"), muted

### Daily readings table
- Columns: Date | Rainfall (mm) | Status | Variance from Threshold
- Status column: green "✓ Below" / amber "⚠ Above"
- Variance: "+Xmm" (above) or "-Xmm" (below)
- Sorted newest first
- Rows above threshold: amber left border highlight
- "Export CSV" button using existing `export.ts` utility

---

## Data Flow

### Contract Detail Page
```
contract-detail.tsx
  → receives: contract (existing prop)
  → receives: beneficiaries (existing prop)
  → NEW: receives: threshold (number), readings (DailyRainfall[])
  → page.tsx fetches:
      1. contract (existing API)
      2. region (existing API) → extract threshold for contract.productId
      3. rainfall feed (mock: getRainfallFeed(contractId, deployedAt, maturityDate))
  → passes to <RainfallSparkline>
```

### Rainfall Full Page
```
src/app/contracts/[id]/rainfall/page.tsx
  → requireAuth()
  → canAccess(user, "contracts")
  → fetch contract (existing API)
  → fetch region (existing API) → extract threshold
  → fetch rainfall feed (mock: getRainfallFeed)
  → renders:
      <Breadcrumb>
      <h1> header
      <BarChart> (full-width)
      <SummaryStrip> (4 stat cards)
      <DataTable> (daily readings)
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/lib/rainfall-mock.ts` | Mock data layer |
| `src/components/contracts/rainfall-sparkline.tsx` | Mini chart for contract detail |
| `src/app/contracts/[id]/rainfall/page.tsx` | Full rainfall dashboard page |

## Files to Modify

| File | Change |
|------|--------|
| `src/lib/api-client.ts` | Add `DailyRainfall` type |
| `src/components/contracts/contract-detail.tsx` | Add RainfallSparkline card + props |
| `src/app/contracts/[id]/page.tsx` | Fetch threshold + rainfall, pass to detail |
| `tests/auth.spec.ts` | Add `/contracts/[id]/rainfall` to protected routes |
| `tests/config.spec.ts` | Add rainfall page to file existence checks |

---

## Testing

- Sparkline renders with mock data (static analysis)
- Threshold line appears at correct value (static analysis)
- Color coding: bars below threshold = teal, above = amber (static analysis)
- Full page has all sections: chart, stats, table, export (static analysis)
- Protected route: redirects to auth when unauthenticated (browser test)
- Mock layer returns correct date range (unit test)

---

## Future Enhancements (Out of Scope)

- Weather station map on full page (MapLibre marker at station location)
- Date range picker to zoom into specific periods
- Compare multiple contracts' rainfall side-by-side
- Real-time rainfall updates via WebSocket
- Historical rainfall trend across years
