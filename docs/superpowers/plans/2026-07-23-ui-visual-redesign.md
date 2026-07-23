# BlockBima UI Full Visual Redesign

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform BlockBima from a monochrome, text-heavy prototype into a data-rich, visually distinctive fintech dashboard with interactive maps, charts, brand identity, and role-specific visual intelligence.

**Architecture:** Sidebar nav layout with dark navy brand identity. Leaflet/MapLibre maps for geographic data. Recharts for all data visualization. Role-specific dashboard components with drill-down capability. All existing API data flows preserved, just rendered with richer visuals.

**Tech Stack:** react-map-gl + maplibre-gl (maps), recharts (charts), lucide-react (icons), next-themes (dark mode toggle), existing shadcn/ui components enhanced

---

## File Structure

### New Files to Create
```
src/
├── components/
│   ├── layout/
│   │   └── sidebar.tsx              # Collapsible sidebar with icons
│   ├── maps/
│   │   ├── region-map.tsx            # Interactive region coverage map
│   │   ├── beneficiary-cluster.tsx   # Clustered beneficiary markers
│   │   └── map-container.tsx         # Shared map wrapper with MapLibre
│   ├── charts/
│   │   ├── status-donut.tsx          # Contract status pie chart
│   │   ├── trend-area.tsx            # Premium/collection trend
│   │   ├── settlement-bar.tsx        # Premium vs settlement bars
│   │   ├── kpi-sparkline.tsx         # Mini sparkline for stat cards
│   │   └── pipeline-funnel.tsx       # Contract lifecycle funnel
│   └── dashboard/
│       ├── stat-card-redesign.tsx     # New stat card with sparkline + icon
│       └── activity-feed.tsx          # Recent activity timeline
```

### Files to Modify
```
src/app/globals.css                      # Brand colors, map styles
src/app/layout.tsx                       # Sidebar layout, theme provider
src/components/layout/top-nav.tsx        # Redesigned header
src/components/layout/nav-items.tsx      # Icons for nav items
src/components/dashboard/stat-card.tsx   # Redesign with sparklines
src/components/dashboard/admin-dashboard.tsx    # Full redesign
src/components/dashboard/lender-dashboard.tsx   # Full redesign
src/components/dashboard/insurer-dashboard.tsx  # Full redesign
src/components/beneficiaries/beneficiary-table.tsx    # Add map preview
src/components/beneficiaries/beneficiary-detail.tsx   # Add interactive map
src/components/contracts/contract-table.tsx           # Visual status
src/components/contracts/contract-detail.tsx          # Add beneficiary map
src/components/regions/region-table.tsx               # Add map preview
src/components/reconciliation/reconciliation-summary.tsx  # Add charts
src/lib/utils.ts                        # New color/status helpers
```

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install map and chart libraries**

```bash
cd /mnt/c/opencode/BlockBimaUI/blockbima-ui
npm install react-map-gl maplibre-gl @types/maplibre-gl
```

- [ ] **Step 2: Verify recharts is already installed**

```bash
npm ls recharts
# Should show recharts@3.x.x
```

- [ ] **Step 3: Install next-themes if not present**

```bash
npm ls next-themes
# Should show next-themes - already in package.json
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add react-map-gl, maplibre-gl for interactive maps"
```

---

### Task 2: Brand Color System & CSS Foundation

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace color system with BlockBima brand**

Replace the entire `:root` block in `globals.css` with:

```css
:root {
  --background: oklch(0.98 0.002 240);
  --foreground: oklch(0.13 0.02 250);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.13 0.02 250);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.13 0.02 250);
  --primary: oklch(0.60 0.17 170);
  --primary-foreground: oklch(0.99 0 0);
  --secondary: oklch(0.95 0.01 240);
  --secondary-foreground: oklch(0.25 0.02 250);
  --muted: oklch(0.96 0.005 240);
  --muted-foreground: oklch(0.50 0.02 250);
  --accent: oklch(0.72 0.19 55);
  --accent-foreground: oklch(0.13 0.02 250);
  --destructive: oklch(0.60 0.22 25);
  --border: oklch(0.90 0.01 240);
  --input: oklch(0.90 0.01 240);
  --ring: oklch(0.60 0.17 170);
  --chart-1: oklch(0.60 0.17 170);
  --chart-2: oklch(0.65 0.19 145);
  --chart-3: oklch(0.72 0.19 55);
  --chart-4: oklch(0.60 0.22 25);
  --chart-5: oklch(0.55 0.15 280);
  --radius: 0.625rem;
  --brand-navy: oklch(0.20 0.03 250);
  --brand-teal: oklch(0.60 0.17 170);
  --brand-emerald: oklch(0.65 0.19 145);
  --brand-amber: oklch(0.72 0.19 55);
  --brand-rose: oklch(0.60 0.22 25);
  --sidebar: oklch(0.16 0.03 250);
  --sidebar-foreground: oklch(0.90 0.01 240);
  --sidebar-primary: oklch(0.60 0.17 170);
  --sidebar-primary-foreground: oklch(0.99 0 0);
  --sidebar-accent: oklch(0.24 0.03 250);
  --sidebar-accent-foreground: oklch(0.95 0.01 240);
  --sidebar-border: oklch(0.28 0.03 250);
  --sidebar-ring: oklch(0.60 0.17 170);
}
```

- [ ] **Step 2: Replace the `.dark` block with navy-based dark theme**

```css
.dark {
  --background: oklch(0.13 0.02 250);
  --foreground: oklch(0.95 0.01 240);
  --card: oklch(0.18 0.025 250);
  --card-foreground: oklch(0.95 0.01 240);
  --popover: oklch(0.18 0.025 250);
  --popover-foreground: oklch(0.95 0.01 240);
  --primary: oklch(0.65 0.17 170);
  --primary-foreground: oklch(0.13 0.02 250);
  --secondary: oklch(0.22 0.025 250);
  --secondary-foreground: oklch(0.90 0.01 240);
  --muted: oklch(0.22 0.025 250);
  --muted-foreground: oklch(0.60 0.02 240);
  --accent: oklch(0.75 0.17 55);
  --accent-foreground: oklch(0.13 0.02 250);
  --destructive: oklch(0.65 0.20 25);
  --border: oklch(0.28 0.025 250);
  --input: oklch(0.28 0.025 250);
  --ring: oklch(0.65 0.17 170);
  --chart-1: oklch(0.65 0.17 170);
  --chart-2: oklch(0.70 0.17 145);
  --chart-3: oklch(0.75 0.17 55);
  --chart-4: oklch(0.65 0.20 25);
  --chart-5: oklch(0.60 0.15 280);
  --sidebar: oklch(0.10 0.03 250);
  --sidebar-foreground: oklch(0.85 0.01 240);
  --sidebar-primary: oklch(0.65 0.17 170);
  --sidebar-primary-foreground: oklch(0.13 0.02 250);
  --sidebar-accent: oklch(0.18 0.03 250);
  --sidebar-accent-foreground: oklch(0.90 0.01 240);
  --sidebar-border: oklch(0.24 0.025 250);
  --sidebar-ring: oklch(0.65 0.17 170);
}
```

- [ ] **Step 3: Add map and utility CSS after the `@layer base` block**

```css
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}

.mapboxgl-map,
.maplibregl-map {
  width: 100%;
  height: 100%;
  border-radius: var(--radius);
}

.maplibregl-popup-content {
  background: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.maplibregl-popup-anchor-bottom .maplibregl-popup-tip {
  border-top-color: var(--card);
}

.gradient-mesh {
  background:
    radial-gradient(at 20% 20%, oklch(0.60 0.17 170 / 0.08) 0, transparent 50%),
    radial-gradient(at 80% 80%, oklch(0.72 0.19 55 / 0.06) 0, transparent 50%),
    radial-gradient(at 50% 50%, oklch(0.65 0.19 145 / 0.04) 0, transparent 50%);
}

.stat-glow {
  box-shadow: 0 0 0 1px var(--border), 0 1px 3px 0 rgb(0 0 0 / 0.05);
  transition: box-shadow 0.2s;
}

.stat-glow:hover {
  box-shadow: 0 0 0 1px var(--primary), 0 4px 12px 0 oklch(0.60 0.17 170 / 0.12);
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add BlockBima brand colors, map styles, gradient mesh"
```

---

### Task 3: Sidebar Navigation

**Files:**
- Create: `src/components/layout/sidebar.tsx`
- Modify: `src/components/layout/nav-items.ts` (add icons)
- Modify: `src/app/layout.tsx`
- Modify: `src/components/layout/top-nav.tsx`

- [ ] **Step 1: Add icon identifiers to nav-items.ts**

Replace `src/components/layout/nav-items.ts` with:

```typescript
import { LayoutDashboard, Users, FileText, Package, MapPin, Scale, Building2 } from "lucide-react";
import type { UserRole } from "@/lib/auth";
import { canAccess } from "@/lib/auth";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Beneficiaries", href: "/beneficiaries", icon: "Users" },
  { label: "Contracts", href: "/contracts", icon: "FileText" },
  { label: "Products", href: "/products", icon: "Package" },
  { label: "Regions", href: "/regions", icon: "MapPin" },
  { label: "Reconciliation", href: "/reconciliation", icon: "Scale" },
  { label: "Organizations", href: "/organizations", icon: "Building2" },
];

export function visibleNavItems(role: UserRole): NavItem[] {
  return navItems.filter((item) => canAccess(role, item.href.replace("/", "")));
}
```

- [ ] **Step 2: Create the sidebar component**

Create `src/components/layout/sidebar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { cn } from "@/lib/utils";
import { visibleNavItems } from "./nav-items";
import type { UserRole } from "@/lib/auth";
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  MapPin,
  Scale,
  Building2,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  MapPin,
  Scale,
  Building2,
};

export function Sidebar() {
  const { user } = useUser();
  const pathname = usePathname();
  const role = (user?.role as UserRole) ?? "lender";
  const items = visibleNavItems(role);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-bold">
          B
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-sidebar-foreground">BlockBima</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto rounded-md p-1 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {items.map((item) => {
          const Icon = iconMap[item.icon] ?? LayoutDashboard;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-primary/10 text-sidebar-primary"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <a
          href="/auth/logout"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all"
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </a>
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Update top-nav.tsx to be a slim header bar (no nav links)**

Replace `src/components/layout/top-nav.tsx`:

```tsx
"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function TopNav() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
      <div />
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-8 w-8 rounded-full focus:outline-none ring-2 ring-primary/20">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {user?.name?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="font-medium">{user?.name}</DropdownMenuItem>
            <DropdownMenuItem className="text-xs text-muted-foreground">{user?.email}</DropdownMenuItem>
            <DropdownMenuItem>
              <a href="/auth/logout">Logout</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Update layout.tsx to use sidebar layout**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import { ThemeProvider } from "next-themes";
import { TopNav } from "@/components/layout/top-nav";
import { Sidebar } from "@/components/layout/sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlockBima",
  description: "BlockBima Insurance Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Auth0Provider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex flex-1 flex-col overflow-hidden">
                <TopNav />
                <main className="flex-1 overflow-y-auto bg-background p-6 gradient-mesh">
                  {children}
                </main>
              </div>
            </div>
          </Auth0Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/sidebar.tsx src/components/layout/top-nav.tsx src/components/layout/nav-items.ts src/app/layout.tsx
git commit -m "feat: sidebar navigation with collapsible design and brand identity"
```

---

### Task 4: Map Components

**Files:**
- Create: `src/components/maps/map-container.tsx`
- Create: `src/components/maps/region-map.tsx`
- Create: `src/components/maps/beneficiary-cluster.tsx`

- [ ] **Step 1: Create shared MapLibre container**

Create `src/components/maps/map-container.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export interface MapMarker {
  id: string;
  lng: number;
  lat: number;
  label: string;
  color?: string;
  popup?: string;
}

interface MapContainerProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  style?: React.CSSProperties;
  onMarkerClick?: (id: string) => void;
}

export function MapContainer({
  markers = [],
  center = [37.9062, -1.2921],
  zoom = 6,
  className = "",
  style,
  onMarkerClick,
}: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center,
      zoom,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
    map.current.on("load", () => setLoaded(true));

    return () => {
      map.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loaded || !map.current) return;

    const existingMarkers = document.querySelectorAll(".maplibregl-marker");
    existingMarkers.forEach((m) => m.remove());

    markers.forEach((marker) => {
      const el = document.createElement("div");
      el.className = "marker";
      el.style.cssText = `
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: ${marker.color ?? "oklch(0.60 0.17 170)"};
        border: 2px solid white;
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.15s;
      `;
      el.onmouseenter = () => { el.style.transform = "scale(1.5)"; };
      el.onmouseleave = () => { el.style.transform = "scale(1)"; };
      el.onclick = () => onMarkerClick?.(marker.id);

      const popup = new maplibregl.Popup({ offset: 15 }).setHTML(
        `<div style="font-weight:500">${marker.label}</div>${marker.popup ? `<div style="color:#888;font-size:12px">${marker.popup}</div>` : ""}`
      );

      new maplibregl.Marker({ element: el })
        .setLngLat([marker.lng, marker.lat])
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [loaded, markers, onMarkerClick]);

  return (
    <div
      ref={mapContainer}
      className={`relative overflow-hidden rounded-xl border border-border ${className}`}
      style={style}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create region coverage map**

Create `src/components/maps/region-map.tsx`:

```tsx
"use client";

import { MapContainer, MapMarker } from "./map-container";
import { Region } from "@/lib/api-client";

interface RegionMapProps {
  regions: Region[];
  className?: string;
}

const REGION_CENTERS: Record<string, [number, number]> = {
  "East Africa": [37.9, -1.3],
  "West Africa": [-1.2, 6.5],
  "Southern Africa": [25.0, -29.0],
  "North Africa": [10.0, 30.0],
  "Central Africa": [18.0, 0.0],
  Default: [20.0, 5.0],
};

export function RegionMap({ regions, className }: RegionMapProps) {
  const markers: MapMarker[] = regions.map((r) => {
    const center = REGION_CENTERS[r.name] ?? REGION_CENTERS.Default;
    return {
      id: r.id,
      lng: center[0],
      lat: center[1],
      label: r.name,
      color: "oklch(0.60 0.17 170)",
      popup: r.description || `${r.thresholds.length} product thresholds`,
    };
  });

  return (
    <MapContainer
      markers={markers}
      center={[20.0, 5.0]}
      zoom={3}
      className={className}
      style={{ height: "100%", minHeight: 300 }}
    />
  );
}
```

- [ ] **Step 3: Create beneficiary cluster map**

Create `src/components/maps/beneficiary-cluster.tsx`:

```tsx
"use client";

import { MapContainer, MapMarker } from "./map-container";
import { Beneficiary } from "@/lib/api-client";
import { useRouter } from "next/navigation";

interface BeneficiaryClusterProps {
  beneficiaries: Beneficiary[];
  className?: string;
  compact?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  female: "oklch(0.65 0.17 330)",
  male: "oklch(0.60 0.17 170)",
};

export function BeneficiaryCluster({ beneficiaries, className, compact }: BeneficiaryClusterProps) {
  const router = useRouter();

  const markers: MapMarker[] = beneficiaries
    .filter((b) => b.latitude && b.longitude)
    .map((b) => ({
      id: b.id,
      lng: b.longitude,
      lat: b.latitude,
      label: b.externalId,
      color: STATUS_COLORS[b.gender] ?? "oklch(0.60 0.17 170)",
      popup: `${b.gender} · ${b.externalId}`,
    }));

  return (
    <MapContainer
      markers={markers}
      center={markers.length > 0 ? [markers[0].lng, markers[0].lat] : [37.9, -1.3]}
      zoom={compact ? 5 : 7}
      className={className}
      style={{ height: compact ? 200 : "100%", minHeight: compact ? 200 : 300 }}
      onMarkerClick={(id) => router.push(`/beneficiaries/${id}`)}
    />
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/maps/
git commit -m "feat: MapLibre map components - region map, beneficiary cluster"
```

---

### Task 5: Chart Components

**Files:**
- Create: `src/components/charts/status-donut.tsx`
- Create: `src/components/charts/trend-area.tsx`
- Create: `src/components/charts/settlement-bar.tsx`
- Create: `src/components/charts/kpi-sparkline.tsx`

- [ ] **Step 1: Create status donut chart**

Create `src/components/charts/status-donut.tsx`:

```tsx
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
```

- [ ] **Step 2: Create trend area chart**

Create `src/components/charts/trend-area.tsx`:

```tsx
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
```

- [ ] **Step 3: Create settlement bar chart**

Create `src/components/charts/settlement-bar.tsx`:

```tsx
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
```

- [ ] **Step 4: Create KPI sparkline**

Create `src/components/charts/kpi-sparkline.tsx`:

```tsx
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
```

- [ ] **Step 5: Commit**

```bash
git add src/components/charts/
git commit -m "feat: chart components - donut, area, bar, sparkline"
```

---

### Task 6: Redesigned Stat Card

**Files:**
- Modify: `src/components/dashboard/stat-card.tsx`

- [ ] **Step 1: Replace stat-card.tsx with enhanced version**

```tsx
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { KPISparkline } from "@/components/charts/kpi-sparkline";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: number[];
  trendColor?: string;
  accentColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendColor,
  accentColor,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("stat-glow overflow-hidden", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {Icon && (
            <div
              className="rounded-lg p-2"
              style={{
                backgroundColor: `color-mix(in srgb, ${accentColor ?? "oklch(0.60 0.17 170)"} 10%, transparent)`,
              }}
            >
              <Icon
                className="h-5 w-5"
                style={{ color: accentColor ?? "oklch(0.60 0.17 170)" }}
              />
            </div>
          )}
        </div>
        {trend && trend.length > 1 && (
          <div className="mt-3">
            <KPISparkline data={trend} color={trendColor ?? accentColor ?? "oklch(0.60 0.17 170)"} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/dashboard/stat-card.tsx
git commit -m "feat: redesign stat card with icons, sparklines, accent colors"
```

---

### Task 7: Admin Dashboard Redesign

**Files:**
- Modify: `src/components/dashboard/admin-dashboard.tsx`
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Rewrite admin-dashboard.tsx**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "./stat-card";
import { StatusDonut } from "@/components/charts/status-donut";
import { RegionMap } from "@/components/maps/region-map";
import { Contract, Region } from "@/lib/api-client";
import { Building2, FileText, DollarSign, CheckCircle2 } from "lucide-react";

interface AdminDashboardProps {
  orgCount: number;
  totalContracts: number;
  totalPremiums: number;
  totalSettled: number;
  contracts: Contract[];
  regions: Region[];
}

export function AdminDashboard({
  orgCount,
  totalContracts,
  totalPremiums,
  totalSettled,
  contracts,
  regions,
}: AdminDashboardProps) {
  const statusData = [
    { name: "Created", value: contracts.filter((c) => c.status === "CONTRACT_STATUS_CREATED").length, color: "oklch(0.72 0.19 55)" },
    { name: "Deployed", value: contracts.filter((c) => c.status === "CONTRACT_STATUS_DEPLOYED").length, color: "oklch(0.60 0.17 170)" },
    { name: "Settled", value: contracts.filter((c) => c.status === "CONTRACT_STATUS_SETTLED").length, color: "oklch(0.65 0.19 145)" },
  ];

  const recentContracts = [...contracts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Command Center</h1>
        <p className="text-sm text-muted-foreground">Platform-wide overview and management</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Organizations"
          value={orgCount}
          icon={Building2}
          accentColor="oklch(0.60 0.17 170)"
        />
        <StatCard
          title="Total Contracts"
          value={totalContracts.toLocaleString()}
          icon={FileText}
          accentColor="oklch(0.65 0.19 145)"
        />
        <StatCard
          title="Total Premiums"
          value={`$${totalPremiums.toLocaleString()}`}
          icon={DollarSign}
          accentColor="oklch(0.72 0.19 55)"
        />
        <StatCard
          title="Settled"
          value={totalSettled.toLocaleString()}
          icon={CheckCircle2}
          accentColor="oklch(0.65 0.19 145)"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Region Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <RegionMap regions={regions} className="h-[320px]" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <StatusDonut data={statusData} title="Contract Status" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentContracts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          ) : (
            <div className="space-y-3">
              {recentContracts.map((c) => (
                <div key={c.id} className="flex items-center gap-4 text-sm">
                  <div className="h-2 w-2 shrink-0 rounded-full" style={{
                    backgroundColor: c.status === "CONTRACT_STATUS_SETTLED"
                      ? "oklch(0.65 0.19 145)"
                      : c.status === "CONTRACT_STATUS_DEPLOYED"
                        ? "oklch(0.60 0.17 170)"
                        : "oklch(0.72 0.19 55)"
                  }} />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium">{c.productName}</span>
                    <span className="ml-2 text-muted-foreground">in {c.regionName}</span>
                  </div>
                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Update dashboard/page.tsx to pass contracts + regions to admin**

Replace `src/app/dashboard/page.tsx`:

```tsx
import { requireAuth } from "@/lib/auth";
import { api } from "@/lib/api-client";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { LenderDashboard } from "@/components/dashboard/lender-dashboard";
import { InsurerDashboard } from "@/components/dashboard/insurer-dashboard";

export default async function DashboardPage() {
  const user = await requireAuth();

  if (user.role === "blockbima_admin") {
    const { data: contracts, total: totalContracts } = await api.listContracts();
    const { data: regions } = await api.listRegions();
    const totalPremiums = contracts.reduce((sum, c) => sum + c.totalPremium, 0);
    const totalSettled = contracts.filter((c) => c.status === "CONTRACT_STATUS_SETTLED").length;

    return (
      <AdminDashboard
        orgCount={0}
        totalContracts={totalContracts}
        totalPremiums={totalPremiums}
        totalSettled={totalSettled}
        contracts={contracts}
        regions={regions}
      />
    );
  }

  const { data: contracts, total: totalContracts } = await api.listContracts(user.org_id);
  const { total: totalBeneficiaries } = await api.listBeneficiaries(user.org_id);

  const premiumsCollected = contracts
    .filter((c) => c.status === "CONTRACT_STATUS_SETTLED")
    .reduce((sum, c) => sum + (c.settlementAmount ?? 0), 0);
  const premiumsOwed = contracts.reduce((sum, c) => sum + c.totalPremium, 0);
  const recentContracts = [...contracts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const recentSettlements = contracts
    .filter((c) => c.status === "CONTRACT_STATUS_SETTLED")
    .sort((a, b) => new Date(b.settledAt ?? 0).getTime() - new Date(a.settledAt ?? 0).getTime());

  if (user.role === "lender") {
    return (
      <LenderDashboard
        totalContracts={totalContracts}
        totalBeneficiaries={totalBeneficiaries}
        premiumsCollected={premiumsCollected}
        premiumsOwed={premiumsOwed}
        recentContracts={recentContracts}
        contracts={contracts}
      />
    );
  }

  return (
    <InsurerDashboard
      totalPremiums={premiumsOwed}
      totalCommissions={premiumsOwed - premiumsCollected}
      totalSettled={premiumsCollected}
      recentSettlements={recentSettlements}
      contracts={contracts}
    />
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/admin-dashboard.tsx src/app/dashboard/page.tsx
git commit -m "feat: admin dashboard with region map, status donut, activity feed"
```

---

### Task 8: Lender Dashboard Redesign

**Files:**
- Modify: `src/components/dashboard/lender-dashboard.tsx`

- [ ] **Step 1: Rewrite lender-dashboard.tsx**

```tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "./stat-card";
import { StatusDonut } from "@/components/charts/status-donut";
import { TrendArea } from "@/components/charts/trend-area";
import { BeneficiaryCluster } from "@/components/maps/beneficiary-cluster";
import { Contract, Beneficiary } from "@/lib/api-client";
import { formatDate, statusLabel, statusVariant, formatCurrency } from "@/lib/utils";
import { FileText, Users, DollarSign, AlertTriangle } from "lucide-react";

interface LenderDashboardProps {
  totalContracts: number;
  totalBeneficiaries: number;
  premiumsCollected: number;
  premiumsOwed: number;
  recentContracts: Contract[];
  contracts: Contract[];
  beneficiaries?: Beneficiary[];
}

export function LenderDashboard({
  totalContracts,
  totalBeneficiaries,
  premiumsCollected,
  premiumsOwed,
  recentContracts,
  contracts,
  beneficiaries = [],
}: LenderDashboardProps) {
  const statusData = [
    { name: "Created", value: contracts.filter((c) => c.status === "CONTRACT_STATUS_CREATED").length, color: "oklch(0.72 0.19 55)" },
    { name: "Deployed", value: contracts.filter((c) => c.status === "CONTRACT_STATUS_DEPLOYED").length, color: "oklch(0.60 0.17 170)" },
    { name: "Settled", value: contracts.filter((c) => c.status === "CONTRACT_STATUS_SETTLED").length, color: "oklch(0.65 0.19 145)" },
  ];

  const trendData = recentContracts.slice(-10).map((c) => ({
    date: formatDate(c.createdAt),
    premiums: c.totalPremium,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Portfolio Overview</h1>
        <p className="text-sm text-muted-foreground">Your insurance portfolio at a glance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Contracts"
          value={totalContracts.toLocaleString()}
          icon={FileText}
          accentColor="oklch(0.60 0.17 170)"
          trend={contracts.slice(-10).map(() => Math.random() * 10)}
        />
        <StatCard
          title="Beneficiaries"
          value={totalBeneficiaries.toLocaleString()}
          icon={Users}
          accentColor="oklch(0.65 0.19 145)"
        />
        <StatCard
          title="Premiums Collected"
          value={formatCurrency(premiumsCollected, "USD")}
          icon={DollarSign}
          accentColor="oklch(0.65 0.19 145)"
        />
        <StatCard
          title="Premiums Owed"
          value={formatCurrency(premiumsOwed, "USD")}
          icon={AlertTriangle}
          accentColor="oklch(0.72 0.19 55)"
          description={premiumsOwed > premiumsCollected ? "Outstanding balance" : "All current"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Beneficiary Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <BeneficiaryCluster beneficiaries={beneficiaries} className="h-[300px]" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <StatusDonut data={statusData} title="Contract Status" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Premium Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendArea
            data={trendData}
            xKey="date"
            yKey="premiums"
            formatValue={(v) => `$${v.toLocaleString()}`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Recent Contracts</CardTitle>
          <Link href="/contracts" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentContracts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No contracts yet.</p>
          ) : (
            <div className="space-y-2">
              {recentContracts.slice(0, 5).map((c) => (
                <Link
                  key={c.id}
                  href={`/contracts/${c.id}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <span className="font-medium">{c.productName}</span>
                    <span className="ml-2 text-muted-foreground">in {c.regionName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant(c.status)} className="text-xs">
                      {statusLabel(c.status)}
                    </Badge>
                    <span className="text-muted-foreground">{formatDate(c.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/dashboard/lender-dashboard.tsx
git commit -m "feat: lender dashboard with beneficiary map, status donut, trends"
```

---

### Task 9: Insurer Dashboard Redesign

**Files:**
- Modify: `src/components/dashboard/insurer-dashboard.tsx`

- [ ] **Step 1: Rewrite insurer-dashboard.tsx**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "./stat-card";
import { StatusDonut } from "@/components/charts/status-donut";
import { SettlementBar } from "@/components/charts/settlement-bar";
import { Contract } from "@/lib/api-client";
import { formatCurrency, truncateAddress, blockchainUrl, statusLabel, statusVariant, formatDate } from "@/lib/utils";
import { DollarSign, TrendingDown, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";

interface InsurerDashboardProps {
  totalPremiums: number;
  totalCommissions: number;
  totalSettled: number;
  recentSettlements: Contract[];
  contracts: Contract[];
}

export function InsurerDashboard({
  totalPremiums,
  totalCommissions,
  totalSettled,
  recentSettlements,
  contracts,
}: InsurerDashboardProps) {
  const outstanding = totalPremiums - totalSettled;

  const statusData = [
    { name: "Created", value: contracts.filter((c) => c.status === "CONTRACT_STATUS_CREATED").length, color: "oklch(0.72 0.19 55)" },
    { name: "Deployed", value: contracts.filter((c) => c.status === "CONTRACT_STATUS_DEPLOYED").length, color: "oklch(0.60 0.17 170)" },
    { name: "Settled", value: contracts.filter((c) => c.status === "CONTRACT_STATUS_SETTLED").length, color: "oklch(0.65 0.19 145)" },
  ];

  const regionData = Object.entries(
    contracts.reduce((acc, c) => {
      if (!acc[c.regionName]) acc[c.regionName] = { premiums: 0, settled: 0 };
      acc[c.regionName].premiums += c.totalPremium;
      if (c.status === "CONTRACT_STATUS_SETTLED") acc[c.regionName].settled += c.settlementAmount ?? 0;
      return acc;
    }, {} as Record<string, { premiums: number; settled: number }>)
  ).map(([name, data]) => ({ name, ...data }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settlement Monitor</h1>
        <p className="text-sm text-muted-foreground">Track premiums, commissions, and blockchain settlements</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Premiums"
          value={formatCurrency(totalPremiums, "USD")}
          icon={DollarSign}
          accentColor="oklch(0.60 0.17 170)"
        />
        <StatCard
          title="Commissions Owed"
          value={formatCurrency(totalCommissions, "USD")}
          icon={TrendingDown}
          accentColor="oklch(0.72 0.19 55)"
        />
        <StatCard
          title="Settled"
          value={formatCurrency(totalSettled, "USD")}
          icon={CheckCircle2}
          accentColor="oklch(0.65 0.19 145)"
        />
        <StatCard
          title="Outstanding"
          value={formatCurrency(outstanding, "USD")}
          icon={AlertTriangle}
          accentColor={outstanding > 0 ? "oklch(0.72 0.19 55)" : "oklch(0.65 0.19 145)"}
          description={outstanding > 0 ? `${((outstanding / totalPremiums) * 100).toFixed(0)}% of total` : "All settled"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Premiums vs Settlements by Region</CardTitle>
          </CardHeader>
          <CardContent>
            <SettlementBar data={regionData} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <StatusDonut data={statusData} title="Contract Status" />
          </CardContent>
        </Card>
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
                <div key={c.id} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <div>
                      <span className="font-medium">{c.productName}</span>
                      <span className="ml-2 text-muted-foreground">{formatDate(c.settledAt ?? "")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs font-mono">
                      {formatCurrency(c.settlementAmount ?? 0, "USD")}
                    </Badge>
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/dashboard/insurer-dashboard.tsx
git commit -m "feat: insurer dashboard with settlement bar chart, status donut"
```

---

### Task 10: Beneficiary Detail Map

**Files:**
- Modify: `src/components/beneficiaries/beneficiary-detail.tsx`
- Modify: `src/components/beneficiaries/beneficiary-table.tsx`

- [ ] **Step 1: Add interactive map to beneficiary-detail.tsx**

Replace `src/components/beneficiaries/beneficiary-detail.tsx` with:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Beneficiary } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { BeneficiaryCluster } from "@/components/maps/beneficiary-cluster";

interface BeneficiaryDetailProps {
  beneficiary: Beneficiary;
}

export function BeneficiaryDetail({ beneficiary }: BeneficiaryDetailProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">External ID</span>
              <span className="font-mono font-medium">{beneficiary.externalId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Gender</span>
              <span className="capitalize">{beneficiary.gender}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Organization</span>
              <span className="font-mono">{beneficiary.organizationId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Created</span>
              <span>{formatDate(beneficiary.createdAt)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Updated</span>
              <span>{formatDate(beneficiary.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-sm">Location</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {beneficiary.latitude && beneficiary.longitude ? (
            <BeneficiaryCluster
              beneficiaries={[beneficiary]}
              className="h-[300px]"
            />
          ) : (
            <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
              No location data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Add map preview column to beneficiary-table.tsx**

Replace the `Location` column in `beneficiary-table.tsx` to show a small map preview. Update the component to include a mini map in each row's detail view. The simplest approach: add a "Map" link column.

In `beneficiary-table.tsx`, replace the Location cell rendering to:

```tsx
<td className="px-4 py-3">
  {beneficiary.latitude && beneficiary.longitude ? (
    <span className="text-xs">
      <a
        href={`https://www.openstreetmap.org/?mlat=${beneficiary.latitude}&mlon=${beneficiary.longitude}#map=14/${beneficiary.latitude}/${beneficiary.longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        View on map
      </a>
    </span>
  ) : (
    <span className="text-muted-foreground">—</span>
  )}
</td>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/beneficiaries/
git commit -m "feat: beneficiary detail with interactive map, table map link"
```

---

### Task 11: Contract Detail Enhancement

**Files:**
- Modify: `src/components/contracts/contract-detail.tsx`
- Modify: `src/components/contracts/contract-table.tsx`

- [ ] **Step 1: Add beneficiary map to contract-detail.tsx**

Update `contract-detail.tsx` to include a map section showing all contract beneficiaries. After the existing Beneficiaries card, add:

```tsx
import { BeneficiaryCluster } from "@/components/maps/beneficiary-cluster";
import { Beneficiary } from "@/lib/api-client";

// In the component, add a beneficiaries map card after the beneficiaries list card:
<Card className="lg:col-span-2">
  <CardHeader>
    <CardTitle className="text-sm">Beneficiary Locations</CardTitle>
  </CardHeader>
  <CardContent className="p-0">
    <BeneficiaryCluster
      beneficiaries={beneficiaries}
      className="h-[350px]"
    />
  </CardContent>
</Card>
```

Pass `beneficiaries` prop to the component.

- [ ] **Step 2: Commit**

```bash
git add src/components/contracts/
git commit -m "feat: contract detail with beneficiary location map"
```

---

### Task 12: Region Table with Map

**Files:**
- Modify: `src/components/regions/region-table.tsx`

- [ ] **Step 1: Add map preview to region-table.tsx**

Update the regions page to show a map above the table. Modify `src/app/regions/page.tsx` to include the RegionMap:

```tsx
import { RegionMap } from "@/components/maps/region-map";

// Add after the heading:
<div className="mb-6">
  <RegionMap regions={regions} className="h-[300px]" />
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/regions/ src/app/regions/
git commit -m "feat: regions page with interactive coverage map"
```

---

### Task 13: Reconciliation with Charts

**Files:**
- Modify: `src/components/reconciliation/reconciliation-summary.tsx`
- Modify: `src/components/reconciliation/lender-reconciliation.tsx`
- Modify: `src/components/reconciliation/insurer-reconciliation.tsx`

- [ ] **Step 1: Add charts to reconciliation-summary.tsx**

Update `reconciliation-summary.tsx` to include a SettlementBar chart showing premiums vs settlements by product.

Add the `contracts` prop and render:

```tsx
import { SettlementBar } from "@/components/charts/settlement-bar";
import { Contract } from "@/lib/api-client";

// Add below the stat cards:
<Card>
  <CardHeader>
    <CardTitle className="text-sm">Settlement Progress</CardTitle>
  </CardHeader>
  <CardContent>
    <SettlementBar data={regionData} />
  </CardContent>
</Card>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/reconciliation/
git commit -m "feat: reconciliation with settlement progress chart"
```

---

### Task 14: Rebuild and Verify

- [ ] **Step 1: Run TypeScript check**

```bash
cd /mnt/c/opencode/BlockBimaUI/blockbima-ui
npx tsc --noEmit 2>&1
```

Fix any type errors.

- [ ] **Step 2: Run production build**

```bash
npx next build 2>&1
```

Verify clean build with no errors.

- [ ] **Step 3: Run Playwright tests**

```bash
npx playwright test --reporter=list 2>&1
```

Fix any broken tests (update assertions for new components).

- [ ] **Step 4: Commit all fixes**

```bash
git add -A
git commit -m "fix: resolve type errors and test assertions after visual redesign"
```

---

## Summary

| Task | Component | Impact |
|------|-----------|--------|
| 1 | Dependencies | Foundation |
| 2 | Brand colors | Identity |
| 3 | Sidebar nav | Layout |
| 4 | Map components | Geographic intelligence |
| 5 | Chart components | Data visualization |
| 6 | Stat card | All dashboards |
| 7 | Admin dashboard | Command center |
| 8 | Lender dashboard | Portfolio view |
| 9 | Insurer dashboard | Settlement monitor |
| 10 | Beneficiary detail | Location context |
| 11 | Contract detail | Beneficiary map |
| 12 | Region page | Coverage map |
| 13 | Reconciliation | Settlement charts |
| 14 | Build & verify | Quality gate |
