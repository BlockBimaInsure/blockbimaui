# BlockBima UI — Technical Documentation

> **Version:** 1.0 — July 23, 2026
> **Status:** Implementation complete, 110/110 Playwright tests passing

---

## 1. Goals

BlockBima UI is a web-based dashboard for the BlockBima parametric insurance platform. It provides three user roles with role-appropriate views for monitoring organizations, browsing beneficiaries/contracts with drill-down detail, reconciling premiums, and verifying smart contract rainfall data on-chain.

### What It Does

- **Admin view:** Platform-wide overview — all organizations, contracts, regions, and beneficiaries across lenders. Region coverage map, contract status breakdown, activity feed.
- **Lender view:** Org-scoped portfolio overview — their contracts, beneficiaries, premium trends, beneficiary location map.
- **Insurer view:** Read-only cross-org settlement monitor — premiums vs settlements by region, settlement evidence links, commission tracking.
- **Reconciliation:** Premium reconciliation table with CSV export for both lenders (collected vs owed) and insurers (received vs expected).
- **Rainfall feed:** Transparent daily rainfall data per smart contract — sparkline in contract detail, full dashboard with interactive chart, summary stats, and exportable CSV.

### What It Does NOT Do

- No beneficiary onboarding (separate pathway exists in backend)
- No product/region/threshold configuration (managed directly in backend)
- No on-ledger transaction submission (read-only blockchain links)

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.11 (App Router, React Server Components, Turbopack) |
| UI Library | shadcn/ui (Radix primitives + Tailwind CSS) |
| Styling | Tailwind CSS v4 with oklch brand color system |
| Auth | Auth0 v4 (`@auth0/nextjs-auth0` v4.25.0) |
| Maps | MapLibre GL v6 (via react-map-gl v8, OSM raster tiles) |
| Charts | Recharts v3.10 |
| Icons | lucide-react v1.25 |
| Themes | next-themes v0.4.6 (dark mode support) |
| Testing | Playwright v1.61.1 |
| Language | TypeScript 5 |
| Deployment | Vercel |

---

## 3. Authentication & Authorization

### Auth0 Configuration

- **Tenant:** `dev-750g0pvvyzusyj31.us.auth0.com`
- **SDK:** `@auth0/nextjs-auth0` v4 — uses `proxy.ts` (not middleware) with `NextResponse.next()` for public routes
- **Public routes:** `/`, `/login`, `/access-denied`, `/auth/*` (callback, logout, login)
- **Session:** Server-side session with `requireAuth()` and `canAccess()` helpers in `src/lib/auth.ts`

### User Roles

| Role | Auth0 value | Access |
|------|------------|--------|
| BlockBima Admin | `blockbima_admin` | Full — all orgs, all pages except Reconciliation |
| Lender | `lender` | Org-scoped — dashboard, beneficiaries, contracts, products, regions, reconciliation |
| Insurer | `insurer` | Read-only, cross-org — products, regions, reconciliation only |

### Role-Gated Navigation

| Page | Admin | Lender | Insurer |
|------|-------|--------|---------|
| Dashboard | yes | yes | yes |
| Beneficiaries | yes | yes | no |
| Contracts | yes | yes | no |
| Products | yes | yes | yes |
| Regions | yes | yes | yes |
| Reconciliation | no | yes | yes |
| Organizations | yes | no | no |

### Auth Flow

1. User visits any protected route → `requireAuth()` returns 401 → redirect to Auth0 login
2. Auth0 authenticates → callback with user metadata (`org_id`, `role`)
3. Session created → user redirected to `/dashboard`
4. Every server component call checks `canAccess(user, route)` — unauthorized → `/access-denied`

### Required Auth0 Callback URLs

For local development on port 3001:
- `http://localhost:3001/auth/callback` (Allowed Callback URLs)
- `http://localhost:3001` (Allowed Logout URLs)
- `http://localhost:3001` (Allowed Web Origins)

---

## 4. Project Structure

```
blockbima-ui/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout: ThemeProvider + Auth0Provider + Sidebar + TopNav
│   │   ├── globals.css                   # Brand colors (oklch), map styles, gradient-mesh
│   │   ├── page.tsx                      # Root page → /dashboard
│   │   ├── access-denied/page.tsx        # 403 page
│   │   ├── dashboard/page.tsx            # Role-based dashboard (fetches contracts, regions)
│   │   ├── beneficiaries/
│   │   │   ├── page.tsx                  # Beneficiary list (pagination, search)
│   │   │   └── [id]/page.tsx             # Beneficiary detail + interactive map
│   │   ├── contracts/
│   │   │   ├── page.tsx                  # Contract list (pagination, filters)
│   │   │   ├── [id]/page.tsx             # Contract detail + sparkline + rainfall
│   │   │   └── [id]/rainfall/
│   │   │       ├── page.tsx              # Full rainfall dashboard
│   │   │       ├── rainfall-chart.tsx     # Interactive bar chart
│   │   │       └── rainfall-table.tsx     # Readings table + CSV export
│   │   ├── products/page.tsx             # Product list (read-only)
│   │   ├── regions/page.tsx              # Region list + interactive map
│   │   ├── reconciliation/page.tsx       # Premium reconciliation
│   │   ├── organizations/
│   │   │   ├── page.tsx                  # Org list (admin only)
│   │   │   └── [id]/page.tsx             # Org detail (admin only)
│   │   └── auth/[...auth0]/route.ts      # Auth0 v4 route handler
│   ├── components/
│   │   ├── layout/
│   │   │   ├── sidebar.tsx               # Collapsible dark navy sidebar with icons
│   │   │   ├── top-nav.tsx               # Slim header with user avatar dropdown
│   │   │   └── nav-items.ts              # Nav items with canAccess role-gating
│   │   ├── dashboard/
│   │   │   ├── stat-card.tsx             # Redesigned with icon + sparkline + accent color
│   │   │   ├── admin-dashboard.tsx       # Region map + status donut + activity feed
│   │   │   ├── lender-dashboard.tsx      # Beneficiary cluster + status donut + trends
│   │   │   └── insurer-dashboard.tsx     # Settlement bar + status donut + settlements list
│   │   ├── charts/
│   │   │   ├── status-donut.tsx          # Recharts PieChart (inner radius)
│   │   │   ├── trend-area.tsx            # Recharts AreaChart (gradient fill)
│   │   │   ├── settlement-bar.tsx        # Recharts BarChart (premiums vs settled)
│   │   │   └── kpi-sparkline.tsx         # Compact 40px AreaChart for stat cards
│   │   ├── maps/
│   │   │   ├── map-container.tsx         # Base MapLibre GL wrapper (OSM tiles)
│   │   │   ├── region-map.tsx            # Region coverage map with predefined centers
│   │   │   └── beneficiary-cluster.tsx   # Beneficiary locations, gender-colored markers
│   │   ├── beneficiaries/
│   │   │   ├── beneficiary-table.tsx
│   │   │   └── beneficiary-detail.tsx    # Interactive map replaces plain lat/lng
│   │   ├── contracts/
│   │   │   ├── contract-table.tsx
│   │   │   ├── contract-detail.tsx       # Overview + blockchain + rainfall sparkline
│   │   │   ├── blockchain-links.tsx      # Truncated address + explorer link + copy
│   │   │   └── rainfall-sparkline.tsx    # Mini bar chart with threshold line
│   │   ├── reconciliation/
│   │   │   └── reconciliation-summary.tsx # Summary + settlement bar chart
│   │   └── ui/                           # shadcn/ui primitives
│   └── lib/
│       ├── auth.ts                       # requireAuth(), UserRole, canAccess()
│       ├── auth0.ts                      # new Auth0Client()
│       ├── api-client.ts                 # API client with types (Beneficiary, Contract, etc.)
│       ├── utils.ts                      # formatCurrency, formatDate, truncateAddress, etc.
│       ├── export.ts                     # CSV export with injection sanitization
│       └── rainfall-mock.ts             # Mock rainfall data (seeded random)
├── tests/
│   ├── auth.spec.ts                      # Auth redirect tests (11 protected routes)
│   ├── security.spec.ts                  # Security headers + content leak tests
│   ├── pages.spec.ts                     # Page layout/structure tests
│   ├── components.spec.ts               # Component behavior tests
│   ├── proxy.spec.ts                     # Auth0 v4 proxy config tests
│   ├── unit-integration.spec.ts          # Module structure + access matrix tests
│   ├── config.spec.ts                    # File existence + config tests
│   └── api-integration.spec.ts           # External API reachability tests
├── playwright.config.ts                  # Forces port 3001, webServer config
├── next.config.ts                        # poweredByHeader: false, security headers
├── package.json
└── .env.local                            # Auth0 credentials, API URL
```

---

## 5. Route Architecture

| Route | Auth | Role | Description |
|-------|------|------|-------------|
| `/` | No | Any | Root redirect → `/dashboard` |
| `/login` | No | Any | Auth0 login redirect |
| `/access-denied` | No | Any | 403 page |
| `/auth/[...auth0]` | No | Any | Auth0 v4 callback handler |
| `/dashboard` | Yes | All | Role-based landing page |
| `/beneficiaries` | Yes | Admin, Lender | Beneficiary list (paginated, searchable) |
| `/beneficiaries/[id]` | Yes | Admin, Lender | Beneficiary detail + interactive map |
| `/contracts` | Yes | Admin, Lender | Contract list (paginated, filterable) |
| `/contracts/[id]` | Yes | Admin, Lender | Contract detail + rainfall sparkline |
| `/contracts/[id]/rainfall` | Yes | Admin, Lender | Full rainfall dashboard |
| `/products` | Yes | All | Product list (read-only) |
| `/regions` | Yes | All | Region list + interactive map |
| `/reconciliation` | Yes | Lender, Insurer | Premium reconciliation |
| `/organizations` | Yes | Admin | Org list + management |
| `/organizations/[id]` | Yes | Admin | Org detail + user management |

---

## 6. Data Model

### Core Types (from `src/lib/api-client.ts`)

```typescript
interface Beneficiary {
  id: string;
  externalId: string;
  organizationId: string;
  gender: string;
  latitude: number;
  longitude: number;
  contracts: string[];
  onboardedAt: string;
}

interface Contract {
  id: string;
  productId: string;
  productName: string;
  regionId: string;
  regionName: string;
  organizationId: string;
  totalPremium: number;
  beneficiaries: string[];
  status: "CONTRACT_STATUS_CREATED" | "CONTRACT_STATUS_DEPLOYED" | "CONTRACT_STATUS_SETTLED";
  deployedAt?: string;
  smartContractAddress?: string;
  maturityDate: string;
  settled: boolean;
  settledAt?: string;
  settlementAmount?: number;
  settlementTransactionId?: string;
  createdAt: string;
  reportInfo?: Record<string, unknown>;
}

interface InsuranceProduct {
  id: string;
  name: string;
  actuary: string;
  premiumAmount: number;
  currency: string;
  periodLength: number;
  periodType: string;
  reportTrigger: string;
}

interface Region {
  id: string;
  name: string;
  description: string;
  thresholds: { productId: string; thresholdValue: number }[];
}

interface DailyRainfall {
  date: string;       // ISO date "2026-03-15"
  amountMm: number;   // Rainfall in millimeters
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  nextPageToken?: string;
}
```

### API Client

- All endpoints return 404 (external API appears down — mock data or graceful degradation)
- Server Components fetch directly (no client-side fetching)
- Cursor-based pagination via `pageToken`/`nextPageToken`
- Organization scoping via `organizationId` in all requests

---

## 7. Visual Design

### Brand Identity

- **Primary:** Teal `oklch(0.60 0.17 170)`
- **Secondary:** Emerald `oklch(0.65 0.19 145)`
- **Accent:** Amber `oklch(0.72 0.19 55)` — threshold warnings, alerts
- **Destructive:** Rose `oklch(0.60 0.22 25)`
- **Sidebar:** Dark navy `oklch(0.16 0.03 250)` background
- **Dark mode:** Full oklch-based dark theme via ThemeProvider

### Layout

- **Sidebar:** Collapsible dark navy sidebar with icon + label navigation, logout at bottom
- **Header:** Slim translucent header with user avatar dropdown (no nav links — those are in sidebar)
- **Content:** Gradient-mesh background with stat-glow hover effects on cards
- **Responsive:** Sidebar collapses to icon-only on narrow screens

### Interactive Elements

- **MapLibre maps:** OpenStreetMap raster tiles, custom styled markers with hover scaling, popups, click-to-navigate
- **Recharts:** Area charts (trends), bar charts (settlements, rainfall), pie/donut charts (status), sparklines (KPIs)
- **Tables:** Scrollable on mobile, sortable, filtered, with hover row highlighting

---

## 8. Feature Details

### Stat Cards

Redesigned with:
- Icon in a tinted background circle
- Large bold value + subtitle
- Optional KPI sparkline (40px area chart)
- Accent color via `oklch` CSS variable
- `stat-glow` hover effect (teal shadow)

### Dashboard Views

**Admin:**
- 4 stat cards (orgs, contracts, premiums, settled) with icons
- Region coverage map (MapLibre, predefined African region centers)
- Status donut (Created/Deployed/Settled)
- Activity feed (5 most recent contracts, color-coded by status)

**Lender:**
- 4 stat cards (contracts, beneficiaries, collected, owed)
- Beneficiary cluster map (gender-colored markers, click to navigate)
- Status donut
- Premium trend area chart
- Recent contracts list with status badges

**Insurer:**
- 4 stat cards (premiums, commissions, settled, outstanding)
- Settlement bar chart (premiums vs settled by region)
- Status donut
- Recent settlements list with blockchain explorer links

### Contract Detail

- Overview card (product, region, premium, maturity, beneficiary count)
- Blockchain card (smart contract address, deployment date, settlement TX)
- Beneficiary IDs list (truncated, clickable)
- Beneficiary location cluster map
- Rainfall sparkline (if deployed) — bar chart with threshold reference line
- Report info (JSON key-value pairs)

### Rainfall Feed

**Contract detail sparkline:**
- 160px bar chart, bars color-coded: teal below threshold, amber above
- Dashed threshold reference line with label
- Summary: days above threshold, peak, total

**Full dashboard page** (`/contracts/[id]/rainfall`):
- Breadcrumb navigation
- 4 stat cards: Days Above Threshold, Peak Rainfall, Average Daily, Days Remaining
- 350px interactive bar chart with CartesianGrid and tooltip
- Daily readings table (newest first) with:
  - Status badge (green "Below" / amber "Above")
  - Variance from threshold (+Xmm / -Xmm)
  - Amber left border on above-threshold rows
  - CSV export button

**Mock data layer:**
- Seeded pseudo-random per contract (deterministic, same data each render)
- ~18% chance of breach day (10-25mm), ~32% light rain (0-8mm), ~50% dry (0mm)
- Clean `getRainfallFeed(contractId, startDate, endDate)` interface — swap body for real API

### Reconciliation

- Summary stat cards (collected, owed, outstanding, percentage)
- Settlement progress bar chart
- Full contract list table with status badges
- CSV export

### Blockchain Links

- Smart contract addresses → XRPL EVM explorer (`https://explorer.xrplevm.org/address/...`)
- On-ledger transactions → main XRPL explorer (`https://livenet.xrpl.org/...`)
- Truncated display (first 6 chars) with copy-to-clipboard and external link icon

---

## 9. Testing

### Test Suite

| Test File | Focus | Methods |
|-----------|-------|---------|
| `auth.spec.ts` | Protected route redirects (11 routes) | HTTP redirect assertions |
| `security.spec.ts` | Security headers, content leaks | Static + browser |
| `pages.spec.ts` | Page structure, content | Static + browser |
| `components.spec.ts` | Component behavior, rendering | Static + browser |
| `proxy.spec.ts` | Auth0 v4 proxy config | Static + browser |
| `unit-integration.spec.ts` | Module structure, access matrix, utils | Static |
| `config.spec.ts` | File existence, config values | Static |
| `api-integration.spec.ts` | External API + Auth0 domain reachability | Static |

### Test Configuration

- **Port:** Forces `localhost:3001` (avoiding port 3000 conflict in WSL)
- **webServer:** `npx next dev --port 3001` (kills previous, clean start)
- **110 tests total**, all passing

---

## 10. Security

### Implemented Measures

- `poweredByHeader: false` (next.config.ts)
- Security headers: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, Strict-Transport-Security
- CSV injection sanitization in `export.ts`
- Role-based access control on every protected route
- No client-side API secret exposure
- `.env.local` gitignored

### Public vs Protected Routes

| Route | Public |
|-------|--------|
| `/` | Yes |
| `/login` | Yes |
| `/access-denied` | Yes (uses `NextResponse.next()`, not auth0 middleware) |
| `/auth/*` | Yes |
| All others | No — require authenticated session |

---

## 11. Known Issues

1. **External API down:** All BlockBima API endpoints return 404 HTML — UI gracefully handles errors
2. **Auth0 callback URL mismatch:** User must add callback/logout/web origins URLs to Auth0 dashboard
3. **Port 3000 conflict:** Unknown WSL process holds port 3000; dev forced to port 3001
4. **GitHub auth expired:** `gh auth login` needed for pushing to remote

---

## 12. Git History

| Commit | Description |
|--------|-------------|
| `c407a13` | feat: implement full BlockBima UI scaffold |
| `4ed5d2f` | fix: adapt Auth0 v4 with proxy middleware and route fixes |
| `8940e2a` | feat: complete BlockBima UI with 110 tests and security audit |
| `f31404e` | feat: add BlockBima UI visual redesign spec and plan |
| `c6435c4` | feat: brand colors, map styles, gradient mesh foundation |
| `a2ad6a4` | feat: sidebar navigation with collapsible design |
| `7e0c0b3` | feat: MapLibre map components - region map, beneficiary cluster |
| `1f54c7c` | feat: chart components - donut, area, bar, sparkline |
| `b4488e0` | feat: redesign stat card with icons, sparklines, accent colors |
| `2e8b751` | feat: admin dashboard with region map, status donut, activity feed |
| `8c026e1` | feat: lender dashboard with beneficiary map, status donut, trends |
| `aa48f03` | feat: insurer dashboard with settlement bar chart, status donut |
| `2a33938` | feat: beneficiary and contract detail visual redesigns |
| `1df8363` | feat: regions page interactive map + reconciliation chart |
| `d625b4a` | test: update Playwright tests for new sidebar layout |
| `a4e1694` | feat: DailyRainfall type and mock data layer |
| `829a4ea` | feat: rainfall sparkline component |
| `4c3f87e` | feat: integrate rainfall sparkline into contract detail |
| `0a9c90f` | feat: full rainfall dashboard with chart, stats, table, CSV export |
| `3d8e45c` | test: add rainfall feed to auth and config tests |
