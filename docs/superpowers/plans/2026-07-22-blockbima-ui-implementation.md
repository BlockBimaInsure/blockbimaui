# BlockBimaUI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a role-based dashboard UI for the BlockBima insurance platform with Auth0 authentication, org-scoped data, and premium reconciliation.

**Architecture:** Next.js 14+ App Router with Server Components for data fetching, shadcn/ui for components, Tailwind for styling. Auth0 handles auth with role-based middleware gating. API calls go through a shared client that attaches org-scoping.

**Tech Stack:** Next.js 14+, React 18, TypeScript, shadcn/ui, Tailwind CSS, Auth0 (`@auth0/nextjs-auth0`), Vercel

---

## File Structure

```
blockbima-ui/
├── src/
│   ├── app/
│   │   ├── layout.tsx                          # Root layout (providers, fonts)
│   │   ├── page.tsx                            # Redirect to /dashboard
│   │   ├── login/
│   │   │   └── page.tsx                        # Auth0 login page
│   │   ├── auth/
│   │   │   ├── callback/
│   │   │   │   └── route.ts                    # Auth0 callback handler
│   │   │   └── logout/
│   │   │       └── route.ts                    # Auth0 logout handler
│   │   ├── dashboard/
│   │   │   └── page.tsx                        # Role-based dashboard
│   │   ├── beneficiaries/
│   │   │   ├── page.tsx                        # List beneficiaries
│   │   │   └── [id]/
│   │   │       └── page.tsx                    # Beneficiary detail
│   │   ├── contracts/
│   │   │   ├── page.tsx                        # List contracts
│   │   │   └── [id]/
│   │   │       └── page.tsx                    # Contract detail
│   │   ├── products/
│   │   │   └── page.tsx                        # List products (read-only)
│   │   ├── regions/
│   │   │   └── page.tsx                        # List regions (read-only)
│   │   ├── reconciliation/
│   │   │   └── page.tsx                        # Reconciliation (lender/insurer)
│   │   ├── organizations/
│   │   │   ├── page.tsx                        # List organizations (admin)
│   │   │   └── [id]/
│   │   │       └── page.tsx                    # Org detail + user mgmt
│   │   └── access-denied/
│   │       └── page.tsx                        # 403 page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── top-nav.tsx                     # Top navigation bar
│   │   │   └── nav-items.ts                    # Navigation items per role
│   │   ├── dashboard/
│   │   │   ├── stat-card.tsx                   # Summary stat card
│   │   │   ├── admin-dashboard.tsx             # Admin dashboard content
│   │   │   ├── lender-dashboard.tsx            # Lender dashboard content
│   │   │   └── insurer-dashboard.tsx           # Insurer dashboard content
│   │   ├── beneficiaries/
│   │   │   ├── beneficiary-table.tsx           # Beneficiary list table
│   │   │   └── beneficiary-detail.tsx          # Beneficiary detail view
│   │   ├── contracts/
│   │   │   ├── contract-table.tsx              # Contract list table
│   │   │   ├── contract-detail.tsx             # Contract detail view
│   │   │   └── blockchain-links.tsx            # Block explorer links
│   │   ├── products/
│   │   │   └── product-table.tsx               # Product list table
│   │   ├── regions/
│   │   │   └── region-table.tsx                # Region list table
│   │   ├── reconciliation/
│   │   │   ├── reconciliation-summary.tsx      # Summary header cards
│   │   │   ├── lender-reconciliation.tsx       # Lender reconciliation view
│   │   │   └── insurer-reconciliation.tsx      # Insurer reconciliation view
│   │   ├── organizations/
│   │   │   ├── organization-table.tsx          # Org list table
│   │   │   └── organization-detail.tsx         # Org detail + users
│   │   └── ui/                                 # shadcn components (auto-generated)
│   ├── lib/
│   │   ├── api-client.ts                       # Shared API client
│   │   ├── auth.ts                             # Auth0 helpers
│   │   └── utils.ts                            # Utility functions (formatting, etc.)
│   └── middleware.ts                           # Auth + role-based route protection
├── public/
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.local                                  # Auth0 + API env vars
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `src/app/layout.tsx`, `src/app/page.tsx`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /mnt/c/opencode/BlockBimaUI
npx create-next-app@latest blockbima-ui --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Expected: Creates `blockbima-ui/` directory with Next.js scaffolded.

- [ ] **Step 2: Install shadcn/ui**

```bash
cd blockbima-ui
npx shadcn@latest init
```

Select: New York style, Zinc color, CSS variables: yes.

- [ ] **Step 3: Add shadcn components**

```bash
npx shadcn@latest add button card table badge skeleton toast dialog input label select dropdown-menu avatar separator tabs
```

- [ ] **Step 4: Install Auth0**

```bash
npm install @auth0/nextjs-auth0
```

- [ ] **Step 5: Install additional dependencies**

```bash
npm install date-fns lucide-react recharts
```

- [ ] **Step 6: Create `.env.local`**

```
AUTH0_SECRET=your-secret-here
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
BLOCKBIMA_API_URL=https://dulcet-sopapillas-05b7ff.netlify.app
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts on http://localhost:3000 without errors.

- [ ] **Step 8: Commit**

```bash
git init && git add -A && git commit -m "feat: scaffold Next.js project with shadcn/ui and Auth0"
```

---

## Task 2: Auth0 Setup & Middleware

**Files:**
- Create: `src/app/auth/callback/route.ts`, `src/app/auth/logout/route.ts`, `src/app/login/page.tsx`, `src/middleware.ts`, `src/lib/auth.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Auth0 route handlers**

Create `src/app/auth/callback/route.ts`:
```typescript
import { handleCallback } from "@auth0/nextjs-auth0";

export const GET = handleCallback();
```

Create `src/app/auth/logout/route.ts`:
```typescript
import { handleLogout } from "@auth0/nextjs-auth0";

export const GET = handleLogout();
```

- [ ] **Step 2: Create login page**

Create `src/app/login/page.tsx`:
```typescript
import { handleLogin } from "@auth0/nextjs-auth0";

export default async function LoginPage() {
  await handleLogin();
}
```

- [ ] **Step 3: Create auth helper with user metadata**

Create `src/lib/auth.ts`:
```typescript
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export type UserRole = "blockbima_admin" | "lender" | "insurer";

export interface AuthUser {
  sub: string;
  email: string;
  name: string;
  org_id: string;
  role: UserRole;
}

export async function requireAuth(): Promise<AuthUser> {
  const session = await getSession();
  if (!session || !session.user) {
    redirect("/api/auth/login");
  }
  return {
    sub: session.user.sub,
    email: session.user.email,
    name: session.user.name,
    org_id: session.user.org_id,
    role: session.user.role,
  };
}

export function hasRole(user: AuthUser, role: UserRole): boolean {
  return user.role === role;
}

export function canAccess(user: AuthUser, resource: string): boolean {
  const roleAccess: Record<UserRole, string[]> = {
    blockbima_admin: ["dashboard", "beneficiaries", "contracts", "products", "regions", "organizations"],
    lender: ["dashboard", "beneficiaries", "contracts", "products", "regions", "reconciliation"],
    insurer: ["dashboard", "products", "regions", "reconciliation"],
  };
  return roleAccess[user.role]?.includes(resource) ?? false;
}
```

- [ ] **Step 4: Create middleware for route protection**

Create `src/middleware.ts`:
```typescript
import { withAuth } from "@auth0/nextjs-auth0/middleware";
import { NextResponse } from "next/server";

function isPublicRoute pathname: string): boolean {
  return ["/", "/login", "/api/auth"].some((prefix) => pathname.startsWith(prefix));
}

export default withAuth({
  middleware: (req) => {
    const { pathname } = req.nextUrl;
    if (isPublicRoute(pathname)) return NextResponse.next();

    const user = req.auth?.user;
    if (!user) {
      return NextResponse.redirect(new URL("/api/auth/login", req.url));
    }
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
```

- [ ] **Step 5: Update root layout with Auth0 provider**

Modify `src/app/layout.tsx` — wrap children with `UserProvider`:
```typescript
import { UserProvider } from "@auth0/nextjs-auth0/client";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Create access-denied page**

Create `src/app/access-denied/page.tsx`:
```typescript
import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">You don't have permission to access this page.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-primary underline">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add Auth0 authentication with role-based middleware"
```

---

## Task 3: API Client

**Files:**
- Create: `src/lib/api-client.ts`, `src/lib/utils.ts`

- [ ] **Step 1: Create API client with types**

Create `src/lib/api-client.ts`:
```typescript
const API_BASE = process.env.BLOCKBIMA_API_URL!;

export interface PaginationParams {
  pageSize?: number;
  pageToken?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  nextPageToken?: string;
}

export interface Beneficiary {
  id: string;
  organizationId: string;
  externalId: string;
  gender: string;
  longitude: number;
  latitude: number;
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  organizationId: string;
  productId: string;
  productName: string;
  regionId: string;
  regionName: string;
  beneficiaries: string[];
  status: "CONTRACT_STATUS_CREATED" | "CONTRACT_STATUS_DEPLOYED" | "CONTRACT_STATUS_SETTLED";
  totalPremium: number;
  maturityDate: string;
  smartContractAddress?: string;
  deployedAt?: string;
  settledAt?: string;
  settlementAmount?: number;
  settlementTransactionId?: string;
  reportInfo?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceProduct {
  id: string;
  name: string;
  premiumAmount: number;
  actuary: string;
  reportDataset: Record<string, unknown>;
  currency: "CURRENCY_USD" | "CURRENCY_KES";
  periodLength: number;
  periodType: "PERIOD_TYPE_DAYS" | "PERIOD_TYPE_WEEKS" | "PERIOD_TYPE_MONTHS" | "PERIOD_TYPE_YEARS";
  reportTrigger: "REPORT_TRIGGER_MATURITY" | "REPORT_TRIGGER_OCCURENCE" | "REPORT_TRIGGER_INTERVAL";
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  isDeleted: boolean;
}

export interface Region {
  id: string;
  name: string;
  description?: string;
  thresholds: { productId: string; thresholdValue: number }[];
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(path, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) url.searchParams.set(key, value);
      });
    }
    const res = await fetch(url.toString(), {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
    return res.json();
  }

  async listBeneficiaries(orgId: string, pagination?: PaginationParams): Promise<PaginatedResponse<Beneficiary>> {
    const res = await this.fetch<{
      beneficiaries: Beneficiary[];
      total: number;
      nextPageToken?: string;
    }>("/beneficiary-management/v1/beneficiaries", {
      organizationId: orgId,
      pageSize: String(pagination?.pageSize ?? 20),
      pageToken: pagination?.pageToken ?? "",
    });
    return { data: res.beneficiaries, total: res.total, nextPageToken: res.nextPageToken };
  }

  async getBeneficiary(id: string): Promise<Beneficiary> {
    const res = await this.fetch<{ beneficiary: Beneficiary }>(
      `/beneficiary-management/v1/beneficiaries/${id}`
    );
    return res.beneficiary;
  }

  async listContracts(
    orgId: string,
    filters?: { productId?: string; regionId?: string; status?: string },
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Contract>> {
    const params: Record<string, string> = {
      organizationId: orgId,
      pageSize: String(pagination?.pageSize ?? 20),
      pageToken: pagination?.pageToken ?? "",
    };
    if (filters?.productId) params.productId = filters.productId;
    if (filters?.regionId) params.regionId = filters.regionId;
    if (filters?.status) params.status = filters.status;

    const res = await this.fetch<{
      contracts: Contract[];
      total: number;
      nextPageToken?: string;
    }>("/contract-management/v1/contracts", params);
    return { data: res.contracts, total: res.total, nextPageToken: res.nextPageToken };
  }

  async getContract(id: string): Promise<Contract> {
    const res = await this.fetch<{ contract: Contract }>(`/contract-management/v1/contracts/${id}`);
    return res.contract;
  }

  async listProducts(pagination?: PaginationParams): Promise<PaginatedResponse<InsuranceProduct>> {
    const res = await this.fetch<{
      products: InsuranceProduct[];
      total: number;
      nextPageToken?: string;
    }>("/product-management/v1/insurance-products", {
      pageSize: String(pagination?.pageSize ?? 20),
      pageToken: pagination?.pageToken ?? "",
    });
    return { data: res.products, total: res.total, nextPageToken: res.nextPageToken };
  }

  async listRegions(pagination?: PaginationParams): Promise<PaginatedResponse<Region>> {
    const res = await this.fetch<{
      regions: Region[];
      total: number;
      nextPageToken?: string;
    }>("/region-management/v1/regions", {
      pageSize: String(pagination?.pageSize ?? 20),
      pageToken: pagination?.pageToken ?? "",
    });
    return { data: res.regions, total: res.total, nextPageToken: res.nextPageToken };
  }
}

export const api = new ApiClient(API_BASE);
```

- [ ] **Step 2: Create utility functions**

Create `src/lib/utils.ts`:
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: "USD" | "KES"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function truncateAddress(address: string, chars: number = 6): string {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    CONTRACT_STATUS_CREATED: "Created",
    CONTRACT_STATUS_DEPLOYED: "Deployed",
    CONTRACT_STATUS_SETTLED: "Settled",
  };
  return labels[status] ?? status;
}

export function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    CONTRACT_STATUS_CREATED: "outline",
    CONTRACT_STATUS_DEPLOYED: "default",
    CONTRACT_STATUS_SETTLED: "secondary",
  };
  return variants[status] ?? "default";
}

export const XRPL_EVM_EXPLORER = "https://explorer.xrp.evm.network";
export const XRPL_EXPLORER = "https://explorer.xrpl.org";

export function blockchainUrl(type: "address" | "tx", value: string): string {
  if (type === "address") return `${XRPL_EVM_EXPLORER}/address/${value}`;
  if (value.length === 66) return `${XRPL_EVM_EXPLORER}/tx/${value}`;
  return `${XRPL_EXPLORER}/transactions/${value}`;
}
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add API client and utility functions"
```

---

## Task 4: Layout & Navigation

**Files:**
- Create: `src/components/layout/top-nav.tsx`, `src/components/layout/nav-items.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create navigation items config**

Create `src/components/layout/nav-items.ts`:
```typescript
import { UserRole } from "@/lib/auth";

export interface NavItem {
  label: string;
  href: string;
  resource: string;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", resource: "dashboard" },
  { label: "Beneficiaries", href: "/beneficiaries", resource: "beneficiaries" },
  { label: "Contracts", href: "/contracts", resource: "contracts" },
  { label: "Products", href: "/products", resource: "products" },
  { label: "Regions", href: "/regions", resource: "regions" },
  { label: "Reconciliation", href: "/reconciliation", resource: "reconciliation" },
  { label: "Organizations", href: "/organizations", resource: "organizations" },
];

export function visibleNavItems(role: UserRole): NavItem[] {
  return navItems.filter((item) => canAccessByRole(role, item.resource));
}

function canAccessByRole(role: UserRole, resource: string): boolean {
  const access: Record<UserRole, string[]> = {
    blockbima_admin: ["dashboard", "beneficiaries", "contracts", "products", "regions", "organizations"],
    lender: ["dashboard", "beneficiaries", "contracts", "products", "regions", "reconciliation"],
    insurer: ["dashboard", "products", "regions", "reconciliation"],
  };
  return access[role]?.includes(resource) ?? false;
}
```

- [ ] **Step 2: Create top navigation component**

Create `src/components/layout/top-nav.tsx`:
```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { visibleNavItems } from "./nav-items";
import { cn } from "@/lib/utils";

export function TopNav() {
  const { user } = useUser();
  const pathname = usePathname();
  const role = user?.role ?? "lender";
  const items = visibleNavItems(role);

  return (
    <header className="border-b bg-white">
      <div className="flex h-14 items-center px-6">
        <Link href="/dashboard" className="mr-8 text-lg font-bold">
          BlockBima
        </Link>
        <nav className="flex items-center gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                pathname === item.href ? "bg-muted text-foreground" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="font-medium">{user?.name}</DropdownMenuItem>
              <DropdownMenuItem className="text-xs text-muted-foreground">{user?.email}</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/api/auth/logout">Logout</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Update root layout**

Modify `src/app/layout.tsx` to include TopNav:
```typescript
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { TopNav } from "@/components/layout/top-nav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <TopNav />
          <main className="min-h-[calc(100vh-3.5rem)] bg-gray-50 p-6">{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Create root page redirect**

Modify `src/app/page.tsx`:
```typescript
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add top navigation with role-based nav items"
```

---

## Task 5: Dashboard — Stat Card & Admin View

**Files:**
- Create: `src/components/dashboard/stat-card.tsx`, `src/components/dashboard/admin-dashboard.tsx`

- [ ] **Step 1: Create stat card component**

Create `src/components/dashboard/stat-card.tsx`:
```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
}

export function StatCard({ title, value, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Create admin dashboard**

Create `src/components/dashboard/admin-dashboard.tsx`:
```typescript
import { StatCard } from "./stat-card";

interface AdminDashboardProps {
  orgCount: number;
  totalContracts: number;
  totalPremiums: number;
  totalSettled: number;
}

export function AdminDashboard({ orgCount, totalContracts, totalPremiums, totalSettled }: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Organizations" value={orgCount} />
        <StatCard title="Total Contracts" value={totalContracts.toLocaleString()} />
        <StatCard title="Total Premiums" value={`$${totalPremiums.toLocaleString()}`} />
        <StatCard title="Settled" value={totalSettled.toLocaleString()} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create dashboard page shell**

Create `src/app/dashboard/page.tsx`:
```typescript
import { requireAuth } from "@/lib/auth";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export default async function DashboardPage() {
  const user = await requireAuth();

  // TODO: Fetch actual data from API in subsequent tasks
  // For now, render with placeholder data
  if (user.role === "blockbima_admin") {
    return <AdminDashboard orgCount={0} totalContracts={0} totalPremiums={0} totalSettled={0} />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome, {user.name}</p>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add stat card component and admin dashboard shell"
```

---

## Task 6: Beneficiary List & Detail

**Files:**
- Create: `src/components/beneficiaries/beneficiary-table.tsx`, `src/components/beneficiaries/beneficiary-detail.tsx`
- Modify: `src/app/beneficiaries/page.tsx`, `src/app/beneficiaries/[id]/page.tsx`

- [ ] **Step 1: Create beneficiary table**

Create `src/components/beneficiaries/beneficiary-table.tsx`:
```typescript
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Beneficiary } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

interface BeneficiaryTableProps {
  beneficiaries: Beneficiary[];
}

export function BeneficiaryTable({ beneficiaries }: BeneficiaryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>External ID</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Created</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {beneficiaries.map((b) => (
          <TableRow key={b.id}>
            <TableCell className="font-mono text-sm">{b.externalId}</TableCell>
            <TableCell>
              <Badge variant="outline">{b.gender || "—"}</Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {b.latitude.toFixed(4)}, {b.longitude.toFixed(4)}
            </TableCell>
            <TableCell className="text-sm">{formatDate(b.createdAt)}</TableCell>
            <TableCell>
              <Link href={`/beneficiaries/${b.id}`} className="text-sm text-primary underline">
                View
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

- [ ] **Step 2: Create beneficiary list page**

Modify `src/app/beneficiaries/page.tsx`:
```typescript
import { requireAuth } from "@/lib/auth";
import { api } from "@/lib/api-client";
import { BeneficiaryTable } from "@/components/beneficiaries/beneficiary-table";

export default async function BeneficiariesPage() {
  const user = await requireAuth();
  const { data: beneficiaries, total } = await api.listBeneficiaries(user.org_id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Beneficiaries</h1>
        <p className="text-sm text-muted-foreground">{total} total</p>
      </div>
      <BeneficiaryTable beneficiaries={beneficiaries} />
    </div>
  );
}
```

- [ ] **Step 3: Create beneficiary detail component**

Create `src/components/beneficiaries/beneficiary-detail.tsx`:
```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Beneficiary } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

interface BeneficiaryDetailProps {
  beneficiary: Beneficiary;
}

export function BeneficiaryDetail({ beneficiary }: BeneficiaryDetailProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Beneficiary {beneficiary.externalId}</h1>
        <p className="text-sm text-muted-foreground">ID: {beneficiary.id}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gender</span>
              <span>{beneficiary.gender || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Organization ID</span>
              <span className="font-mono text-xs">{beneficiary.organizationId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{formatDate(beneficiary.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Updated</span>
              <span>{formatDate(beneficiary.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Latitude</span>
              <span>{beneficiary.latitude}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Longitude</span>
              <span>{beneficiary.longitude}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create beneficiary detail page**

Create `src/app/beneficiaries/[id]/page.tsx`:
```typescript
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { api } from "@/lib/api-client";
import { BeneficiaryDetail } from "@/components/beneficiaries/beneficiary-detail";

export default async function BeneficiaryDetailPage({ params }: { params: { id: string } }) {
  await requireAuth();
  try {
    const beneficiary = await api.getBeneficiary(params.id);
    return <BeneficiaryDetail beneficiary={beneficiary} />;
  } catch {
    notFound();
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add beneficiary list and detail pages"
```

---

## Task 7: Contract List & Detail

**Files:**
- Create: `src/components/contracts/contract-table.tsx`, `src/components/contracts/contract-detail.tsx`, `src/components/contracts/blockchain-links.tsx`
- Modify: `src/app/contracts/page.tsx`, `src/app/contracts/[id]/page.tsx`

- [ ] **Step 1: Create blockchain links component**

Create `src/components/contracts/blockchain-links.tsx`:
```typescript
import { Badge } from "@/components/ui/badge";
import { truncateAddress, blockchainUrl, formatDate } from "@/lib/utils";
import { ExternalLink, Copy } from "lucide-react";

interface BlockchainLinksProps {
  smartContractAddress?: string;
  deployedAt?: string;
  settlementTransactionId?: string;
  settlementAmount?: number;
  settledAt?: string;
}

export function BlockchainLinks({
  smartContractAddress,
  deployedAt,
  settlementTransactionId,
  settlementAmount,
  settledAt,
}: BlockchainLinksProps) {
  return (
    <div className="space-y-4">
      {smartContractAddress && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Contract:</span>
          <a
            href={blockchainUrl("address", smartContractAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-mono text-xs text-primary hover:underline"
          >
            {truncateAddress(smartContractAddress, 8)}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
      {deployedAt && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Deployed:</span>
          <span>{formatDate(deployedAt)}</span>
        </div>
      )}
      {settlementTransactionId && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Settlement TX:</span>
          <a
            href={blockchainUrl("tx", settlementTransactionId)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-mono text-xs text-primary hover:underline"
          >
            {truncateAddress(settlementTransactionId, 8)}
            <ExternalLink className="h-3 w-3" />
          </a>
          {settlementAmount !== undefined && (
            <Badge variant="secondary">${settlementAmount.toLocaleString()}</Badge>
          )}
        </div>
      )}
      {settledAt && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Settled:</span>
          <span>{formatDate(settledAt)}</span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create contract table**

Create `src/components/contracts/contract-table.tsx`:
```typescript
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Contract } from "@/lib/api-client";
import { formatDate, statusLabel, statusVariant, formatCurrency } from "@/lib/utils";

interface ContractTableProps {
  contracts: Contract[];
}

export function ContractTable({ contracts }: ContractTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Region</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Premium</TableHead>
          <TableHead>Maturity</TableHead>
          <TableHead>Beneficiaries</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contracts.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-medium">{c.productName}</TableCell>
            <TableCell>{c.regionName}</TableCell>
            <TableCell>
              <Badge variant={statusVariant(c.status)}>{statusLabel(c.status)}</Badge>
            </TableCell>
            <TableCell>{formatCurrency(c.totalPremium, "USD")}</TableCell>
            <TableCell className="text-sm">{formatDate(c.maturityDate)}</TableCell>
            <TableCell className="text-sm">{c.beneficiaries.length}</TableCell>
            <TableCell>
              <Link href={`/contracts/${c.id}`} className="text-sm text-primary underline">
                View
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

- [ ] **Step 3: Create contract detail**

Create `src/components/contracts/contract-detail.tsx`:
```typescript
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Contract } from "@/lib/api-client";
import { formatDate, statusLabel, statusVariant, formatCurrency } from "@/lib/utils";
import { BlockchainLinks } from "./blockchain-links";

interface ContractDetailProps {
  contract: Contract;
}

export function ContractDetail({ contract }: ContractDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contract</h1>
          <p className="font-mono text-sm text-muted-foreground">{contract.id}</p>
        </div>
        <Badge variant={statusVariant(contract.status)} className="text-sm">
          {statusLabel(contract.status)}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product</span>
              <span className="font-medium">{contract.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Region</span>
              <span>{contract.regionName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Premium</span>
              <span className="font-medium">{formatCurrency(contract.totalPremium, "USD")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Maturity Date</span>
              <span>{formatDate(contract.maturityDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Beneficiaries</span>
              <span>{contract.beneficiaries.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Blockchain</CardTitle>
          </CardHeader>
          <CardContent>
            <BlockchainLinks
              smartContractAddress={contract.smartContractAddress}
              deployedAt={contract.deployedAt}
              settlementTransactionId={contract.settlementTransactionId}
              settlementAmount={contract.settlementAmount}
              settledAt={contract.settledAt}
            />
            {!contract.smartContractAddress && (
              <p className="text-sm text-muted-foreground">Not yet deployed</p>
            )}
          </CardContent>
        </Card>
      </div>

      {contract.beneficiaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Beneficiaries ({contract.beneficiaries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {contract.beneficiaries.map((bId) => (
                <Link
                  key={bId}
                  href={`/beneficiaries/${bId}`}
                  className="rounded-md border px-3 py-1 text-xs font-mono text-primary hover:bg-muted"
                >
                  {bId.slice(0, 8)}...
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {contract.reportInfo && Object.keys(contract.reportInfo).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Report Info</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-1 text-sm">
              {Object.entries(contract.reportInfo).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <dt className="text-muted-foreground">{key}</dt>
                  <dd className="font-mono">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create contract list page**

Modify `src/app/contracts/page.tsx`:
```typescript
import { requireAuth } from "@/lib/auth";
import { api } from "@/lib/api-client";
import { ContractTable } from "@/components/contracts/contract-table";

export default async function ContractsPage() {
  const user = await requireAuth();
  const { data: contracts, total } = await api.listContracts(user.org_id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contracts</h1>
        <p className="text-sm text-muted-foreground">{total} total</p>
      </div>
      <ContractTable contracts={contracts} />
    </div>
  );
}
```

- [ ] **Step 5: Create contract detail page**

Create `src/app/contracts/[id]/page.tsx`:
```typescript
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { api } from "@/lib/api-client";
import { ContractDetail } from "@/components/contracts/contract-detail";

export default async function ContractDetailPage({ params }: { params: { id: string } }) {
  await requireAuth();
  try {
    const contract = await api.getContract(params.id);
    return <ContractDetail contract={contract} />;
  } catch {
    notFound();
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add contract list, detail, and blockchain links"
```

---

## Task 8: Product & Region Lists

**Files:**
- Create: `src/components/products/product-table.tsx`, `src/components/regions/region-table.tsx`
- Modify: `src/app/products/page.tsx`, `src/app/regions/page.tsx`

- [ ] **Step 1: Create product table**

Create `src/components/products/product-table.tsx`:
```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { InsuranceProduct } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";

interface ProductTableProps {
  products: InsuranceProduct[];
}

export function ProductTable({ products }: ProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Actuary</TableHead>
          <TableHead>Premium</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Period</TableHead>
          <TableHead>Report Trigger</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell>{p.actuary}</TableCell>
            <TableCell>{formatCurrency(p.premiumAmount, p.currency === "CURRENCY_KES" ? "KES" : "USD")}</TableCell>
            <TableCell>
              <Badge variant="outline">{p.currency.replace("CURRENCY_", "")}</Badge>
            </TableCell>
            <TableCell>
              {p.periodLength} {p.periodType.replace("PERIOD_TYPE_", "").toLowerCase()}
            </TableCell>
            <TableCell>{p.reportTrigger.replace("REPORT_TRIGGER_", "").toLowerCase()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

- [ ] **Step 2: Create product list page**

Modify `src/app/products/page.tsx`:
```typescript
import { requireAuth } from "@/lib/auth";
import { api } from "@/lib/api-client";
import { ProductTable } from "@/components/products/product-table";

export default async function ProductsPage() {
  await requireAuth();
  const { data: products, total } = await api.listProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Products</h1>
        <p className="text-sm text-muted-foreground">{total} total</p>
      </div>
      <ProductTable products={products} />
    </div>
  );
}
```

- [ ] **Step 3: Create region table**

Create `src/components/regions/region-table.tsx`:
```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Region } from "@/lib/api-client";

interface RegionTableProps {
  regions: Region[];
}

export function RegionTable({ regions }: RegionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Thresholds</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {regions.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">{r.name}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{r.description || "—"}</TableCell>
            <TableCell className="text-sm">{r.thresholds.length} product thresholds</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

- [ ] **Step 4: Create region list page**

Modify `src/app/regions/page.tsx`:
```typescript
import { requireAuth } from "@/lib/auth";
import { api } from "@/lib/api-client";
import { RegionTable } from "@/components/regions/region-table";

export default async function RegionsPage() {
  await requireAuth();
  const { data: regions, total } = await api.listRegions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Regions</h1>
        <p className="text-sm text-muted-foreground">{total} total</p>
      </div>
      <RegionTable regions={regions} />
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add product and region list pages (read-only)"
```

---

## Task 9: Reconciliation Views

**Files:**
- Create: `src/components/reconciliation/reconciliation-summary.tsx`, `src/components/reconciliation/lender-reconciliation.tsx`, `src/components/reconciliation/insurer-reconciliation.tsx`
- Modify: `src/app/reconciliation/page.tsx`

- [ ] **Step 1: Create reconciliation summary**

Create `src/components/reconciliation/reconciliation-summary.tsx`:
```typescript
import { StatCard } from "@/components/dashboard/stat-card";

interface ReconciliationSummaryProps {
  totalCollected: number;
  totalOwed: number;
  outstanding: number;
}

export function ReconciliationSummary({ totalCollected, totalOwed, outstanding }: ReconciliationSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard title="Premiums Collected" value={`$${totalCollected.toLocaleString()}`} />
      <StatCard title="Owed to Insurer" value={`$${totalOwed.toLocaleString()}`} />
      <StatCard
        title="Outstanding"
        value={`$${outstanding.toLocaleString()}`}
        description={outstanding > 0 ? "Amount remaining" : "All settled"}
      />
    </div>
  );
}
```

- [ ] **Step 2: Create lender reconciliation view**

Create `src/components/reconciliation/lender-reconciliation.tsx`:
```typescript
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Contract } from "@/lib/api-client";
import { formatDate, statusLabel, statusVariant, formatCurrency } from "@/lib/utils";
import { ReconciliationSummary } from "./reconciliation-summary";

interface LenderReconciliationProps {
  contracts: Contract[];
  totalCollected: number;
  totalOwed: number;
}

export function LenderReconciliation({ contracts, totalCollected, totalOwed }: LenderReconciliationProps) {
  const outstanding = totalOwed - totalCollected;

  return (
    <div className="space-y-6">
      <ReconciliationSummary totalCollected={totalCollected} totalOwed={totalOwed} outstanding={outstanding} />
      <div>
        <h2 className="text-lg font-semibold">Contracts</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Premium</TableHead>
              <TableHead>Maturity</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs">{c.id.slice(0, 8)}...</TableCell>
                <TableCell>{c.productName}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(c.status)}>{statusLabel(c.status)}</Badge>
                </TableCell>
                <TableCell>{formatCurrency(c.totalPremium, "USD")}</TableCell>
                <TableCell className="text-sm">{formatDate(c.maturityDate)}</TableCell>
                <TableCell>
                  <Link href={`/contracts/${c.id}`} className="text-xs text-primary underline">
                    Details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create insurer reconciliation view**

Create `src/components/reconciliation/insurer-reconciliation.tsx`:
```typescript
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Contract } from "@/lib/api-client";
import { formatDate, statusLabel, statusVariant, formatCurrency, truncateAddress, blockchainUrl } from "@/lib/utils";
import { ReconciliationSummary } from "./reconciliation-summary";
import { ExternalLink } from "lucide-react";

interface InsurerReconciliationProps {
  contracts: Contract[];
  totalExpected: number;
  totalReceived: number;
}

export function InsurerReconciliation({ contracts, totalExpected, totalReceived }: InsurerReconciliationProps) {
  const commissions = totalExpected - totalReceived;

  return (
    <div className="space-y-6">
      <ReconciliationSummary totalCollected={totalReceived} totalOwed={totalExpected} outstanding={commissions} />
      <div>
        <h2 className="text-lg font-semibold">All Contracts</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Premium</TableHead>
              <TableHead>Settlement</TableHead>
              <TableHead>Evidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs">{c.id.slice(0, 8)}...</TableCell>
                <TableCell>{c.productName}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(c.status)}>{statusLabel(c.status)}</Badge>
                </TableCell>
                <TableCell>{formatCurrency(c.totalPremium, "USD")}</TableCell>
                <TableCell>
                  {c.settlementAmount !== undefined
                    ? formatCurrency(c.settlementAmount, "USD")
                    : "—"}
                </TableCell>
                <TableCell>
                  {c.settlementTransactionId ? (
                    <a
                      href={blockchainUrl("tx", c.settlementTransactionId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                    >
                      {truncateAddress(c.settlementTransactionId, 6)}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create reconciliation page**

Modify `src/app/reconciliation/page.tsx`:
```typescript
import { requireAuth } from "@/lib/auth";
import { api } from "@/lib/api-client";
import { LenderReconciliation } from "@/components/reconciliation/lender-reconciliation";
import { InsurerReconciliation } from "@/components/reconciliation/insurer-reconciliation";

export default async function ReconciliationPage() {
  const user = await requireAuth();
  const { data: contracts } = await api.listContracts(user.org_id);

  const totalPremiums = contracts.reduce((sum, c) => sum + c.totalPremium, 0);
  const totalSettled = contracts
    .filter((c) => c.status === "CONTRACT_STATUS_SETTLED")
    .reduce((sum, c) => sum + (c.settlementAmount ?? 0), 0);

  if (user.role === "insurer") {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Reconciliation</h1>
        <InsurerReconciliation
          contracts={contracts}
          totalExpected={totalPremiums}
          totalReceived={totalSettled}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reconciliation</h1>
      <LenderReconciliation
        contracts={contracts}
        totalCollected={totalSettled}
        totalOwed={totalPremiums}
      />
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add reconciliation views for lender and insurer"
```

---

## Task 10: Organization Management (Admin)

**Files:**
- Create: `src/components/organizations/organization-table.tsx`, `src/components/organizations/organization-detail.tsx`
- Modify: `src/app/organizations/page.tsx`, `src/app/organizations/[id]/page.tsx`

- [ ] **Step 1: Create organization table**

Create `src/components/organizations/organization-table.tsx`:
```typescript
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Organization {
  id: string;
  name: string;
  type: string;
  userCount: number;
  contractCount: number;
  createdAt: string;
}

interface OrganizationTableProps {
  organizations: Organization[];
}

export function OrganizationTable({ organizations }: OrganizationTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Users</TableHead>
          <TableHead>Contracts</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations.map((org) => (
          <TableRow key={org.id}>
            <TableCell className="font-medium">{org.name}</TableCell>
            <TableCell>{org.type}</TableCell>
            <TableCell>{org.userCount}</TableCell>
            <TableCell>{org.contractCount}</TableCell>
            <TableCell>
              <Link href={`/organizations/${org.id}`} className="text-sm text-primary underline">
                View
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

- [ ] **Step 2: Create organization list page**

Create `src/app/organizations/page.tsx`:
```typescript
import { requireAuth, canAccess } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OrganizationTable } from "@/components/organizations/organization-table";

export default async function OrganizationsPage() {
  const user = await requireAuth();
  if (!canAccess(user, "organizations")) redirect("/access-denied");

  // TODO: Fetch organizations from API when org management endpoint is available
  const organizations: any[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Organizations</h1>
        <p className="text-sm text-muted-foreground">{organizations.length} total</p>
      </div>
      <OrganizationTable organizations={organizations} />
    </div>
  );
}
```

- [ ] **Step 3: Create organization detail page**

Create `src/app/organizations/[id]/page.tsx`:
```typescript
import { requireAuth, canAccess } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OrganizationDetailPage({ params }: { params: { id: string } }) {
  const user = await requireAuth();
  if (!canAccess(user, "organizations")) redirect("/access-denied");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Organization Detail</h1>
      <p className="text-muted-foreground">Organization: {params.id}</p>
      {/* TODO: Fetch org details and users when API endpoint is available */}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add organization management pages (admin)"
```

---

## Task 11: Dashboard Data Integration

**Files:**
- Modify: `src/app/dashboard/page.tsx`, `src/components/dashboard/admin-dashboard.tsx`, `src/components/dashboard/lender-dashboard.tsx`, `src/components/dashboard/insurer-dashboard.tsx`

- [ ] **Step 1: Create lender dashboard component**

Create `src/components/dashboard/lender-dashboard.tsx`:
```typescript
import Link from "next/link";
import { StatCard } from "./stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Contract } from "@/lib/api-client";
import { formatDate, statusLabel, statusVariant, formatCurrency } from "@/lib/utils";

interface LenderDashboardProps {
  totalContracts: number;
  totalBeneficiaries: number;
  premiumsCollected: number;
  premiumsOwed: number;
  recentContracts: Contract[];
}

export function LenderDashboard({
  totalContracts,
  totalBeneficiaries,
  premiumsCollected,
  premiumsOwed,
  recentContracts,
}: LenderDashboardProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Contracts" value={totalContracts.toLocaleString()} />
        <StatCard title="Beneficiaries" value={totalBeneficiaries.toLocaleString()} />
        <StatCard title="Premiums Collected" value={`$${premiumsCollected.toLocaleString()}`} />
        <StatCard title="Premiums Owed" value={`$${premiumsOwed.toLocaleString()}`} />
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Recent Contracts</CardTitle>
          <Link href="/contracts" className="text-xs text-primary underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentContracts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No contracts yet.</p>
          ) : (
            <div className="space-y-2">
              {recentContracts.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between text-sm">
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

- [ ] **Step 2: Create insurer dashboard component**

Create `src/components/dashboard/insurer-dashboard.tsx`:
```typescript
import { StatCard } from "./stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Contract } from "@/lib/api-client";
import { formatCurrency, truncateAddress, blockchainUrl } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface InsurerDashboardProps {
  totalPremiums: number;
  totalCommissions: number;
  totalSettled: number;
  recentSettlements: Contract[];
}

export function InsurerDashboard({
  totalPremiums,
  totalCommissions,
  totalSettled,
  recentSettlements,
}: InsurerDashboardProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Premiums" value={`$${totalPremiums.toLocaleString()}`} />
        <StatCard title="Commissions Owed" value={`$${totalCommissions.toLocaleString()}`} />
        <StatCard title="Settled" value={`$${totalSettled.toLocaleString()}`} />
        <StatCard title="Outstanding" value={`$${(totalPremiums - totalSettled).toLocaleString()}`} />
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
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{c.productName}</span>
                  <div className="flex items-center gap-3">
                    <span>{formatCurrency(c.settlementAmount ?? 0, "USD")}</span>
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

- [ ] **Step 3: Update dashboard page with data fetching**

Modify `src/app/dashboard/page.tsx`:
```typescript
import { requireAuth } from "@/lib/auth";
import { api } from "@/lib/api-client";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { LenderDashboard } from "@/components/dashboard/lender-dashboard";
import { InsurerDashboard } from "@/components/dashboard/insurer-dashboard";

export default async function DashboardPage() {
  const user = await requireAuth();

  if (user.role === "blockbima_admin") {
    // Admin sees org-level aggregates — for now placeholder until org list API is available
    return <AdminDashboard orgCount={0} totalContracts={0} totalPremiums={0} totalSettled={0} />;
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
      />
    );
  }

  // Insurer
  return (
    <InsurerDashboard
      totalPremiums={premiumsOwed}
      totalCommissions={premiumsOwed - premiumsCollected}
      totalSettled={premiumsCollected}
      recentSettlements={recentSettlements}
    />
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: integrate dashboard with API data for all roles"
```

---

## Task 12: Pagination & Error Handling

**Files:**
- Create: `src/components/ui/pagination.tsx`
- Modify: `src/lib/api-client.ts`, `src/middleware.ts`

- [ ] **Step 1: Add pagination component**

Create `src/components/ui/pagination.tsx`:
```typescript
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export function Pagination({ onNext, onPrevious, hasNext, hasPrevious }: PaginationProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline" size="sm" onClick={onPrevious} disabled={!hasPrevious}>
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <Button variant="outline" size="sm" onClick={onNext} disabled={!hasNext}>
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: Add error boundary**

Create `src/app/error.tsx`:
```typescript
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
        <Button onClick={reset} className="mt-4">
          Try again
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create not-found page**

Create `src/app/not-found.tsx`:
```typescript
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-primary underline">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add pagination, error boundary, and not-found page"
```

---

## Task 13: Responsive Design & Polish

**Files:**
- Modify: `src/components/layout/top-nav.tsx`, `src/app/globals.css`

- [ ] **Step 1: Add mobile hamburger menu to top nav**

Modify `src/components/layout/top-nav.tsx` — add mobile menu with Sheet component:
```typescript
// Add Sheet import and mobile toggle button
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

// Inside the component, add mobile menu:
<div className="md:hidden">
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon">
        <Menu className="h-5 w-5" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <nav className="flex flex-col gap-2 mt-8">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
              pathname === item.href ? "bg-muted" : ""
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </SheetContent>
  </Sheet>
</div>
```

- [ ] **Step 2: Add shadcn Sheet component**

```bash
npx shadcn@latest add sheet
```

- [ ] **Step 3: Verify responsive behavior**

```bash
npm run dev
```

Open browser at mobile width (375px) and verify hamburger menu appears and nav items collapse.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add responsive mobile navigation"
```

---

## Task 14: Export Functionality

**Files:**
- Create: `src/lib/export.ts`

- [ ] **Step 1: Create CSV export utility**

Create `src/lib/export.ts`:
```typescript
export function exportToCsv(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = String(row[h] ?? "");
          return val.includes(",") || val.includes('"') || val.includes("\n")
            ? `"${val.replace(/"/g, '""')}"`
            : val;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}
```

- [ ] **Step 2: Add export buttons to reconciliation views**

Add to both `lender-reconciliation.tsx` and `insurer-reconciliation.tsx`:
```typescript
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToCsv } from "@/lib/export";

// Add export button in the header area
<Button
  variant="outline"
  size="sm"
  onClick={() =>
    exportToCsv(
      contracts.map((c) => ({
        id: c.id,
        product: c.productName,
        status: c.status,
        premium: c.totalPremium,
        maturityDate: c.maturityDate,
      })),
      "reconciliation"
    )
  }
>
  <Download className="mr-2 h-4 w-4" />
  Export CSV
</Button>
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add CSV export for reconciliation views"
```

---

## Task 15: Final Verification

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Expected: No errors.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: Build succeeds without errors.

- [ ] **Step 3: Manual smoke test**

```bash
npm run dev
```

Verify in browser:
1. Login flow works with Auth0
2. Dashboard loads with role-appropriate content
3. Navigation shows correct items per role
4. Beneficiary list and detail pages render
5. Contract list and detail pages render with blockchain links
6. Products and regions pages render
7. Reconciliation page renders for lender and insurer roles
8. Organization page is admin-only
9. Access denied page shows for unauthorized routes
10. Responsive layout works on mobile

- [ ] **Step 4: Final commit**

```bash
git add -A && git commit -m "chore: final verification and cleanup"
```
