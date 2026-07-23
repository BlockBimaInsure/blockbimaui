# BlockBimaUI Design Spec

## Overview

A web-based dashboard UI for the BlockBima insurance platform. The application provides role-based views for three user types: BlockBima administrators, lender staff (clients), and insurer staff (read-only). The primary use cases are organizational monitoring, beneficiary/contract browsing with drill-down detail, and premium reconciliation with exportable reports.

The UI does **not** handle beneficiary onboarding (a separate pathway exists) or product/region/threshold configuration (managed directly in the backend).

## Users & Roles

| Role | Access Level | Primary Tasks |
|------|-------------|---------------|
| BlockBima Admin | Full (all orgs) | Monitor all organizations, manage orgs and users |
| Lender Staff | Org-scoped | Overview of their org's data, drill into details, reconcile premiums |
| Insurer Staff | Read-only, cross-org | Reconcile premiums and commissions, view settlement evidence |

Lender organization admins can add other users to the app within their organization.

## Tech Stack

- **Framework:** Next.js 14+ (App Router, React Server Components)
- **UI Library:** shadcn/ui (Radix primitives + Tailwind CSS)
- **Styling:** Tailwind CSS
- **Auth:** Auth0 (`@auth0/nextjs-auth0`)
- **Deployment:** Vercel
- **Language:** TypeScript

## Architecture

### Auth Flow

1. User visits `/login` → redirected to Auth0 login page
2. Auth0 authenticates and returns with user metadata: `org_id` and `role` (`blockbima_admin` | `lender` | `insurer`)
3. Next.js middleware checks the session on every request — unauthorized users are redirected to login
4. The user's `org_id` is attached to all API calls so the backend returns only org-scoped data
5. Role determines which navigation items and pages are accessible

### API Integration

- Server Components fetch data directly from the BlockBima API (no client-side fetching for list/detail pages)
- A shared API client handles auth headers, pagination, and error handling
- Organization scoping enforced by including `organizationId` in all API requests
- All list endpoints use cursor-based pagination (`pageToken`/`nextPageToken`)

### Route Structure

```
/login                    — Auth0 login redirect
/dashboard                — Role-based landing (different content per role)
/organizations            — Admin only: list/manage orgs
/organizations/[id]       — Admin only: org detail
/beneficiaries            — List + search beneficiaries
/beneficiaries/[id]       — Beneficiary detail + contracts
/contracts                — List + filter contracts
/contracts/[id]           — Contract detail + settlement evidence
/products                 — List products (read-only)
/regions                  — List regions (read-only)
/reconciliation           — Lender + Insurer: premium reconciliation
```

### Blockchain Links

All blockchain references link to block explorers:
- **Smart contract addresses and EVM transactions:** XRPL EVM Block Explorer
- **On-ledger XRP transactions:** Main XRP Ledger Explorer

Addresses and transaction IDs are displayed truncated with a copy-to-clipboard button and an external link to the appropriate explorer.

## Layout & Navigation

**Top navigation bar** (horizontal) with the BlockBima logo on the left, nav items in the center, and user profile/avatar on the right.

Navigation items are role-gated:

| Nav Item | Admin | Lender | Insurer |
|----------|-------|--------|---------|
| Dashboard | yes | yes | yes |
| Beneficiaries | yes | yes | no |
| Contracts | yes | yes | no |
| Products | yes | yes | yes |
| Regions | yes | yes | yes |
| Reconciliation | no | yes | yes |
| Organizations | yes | no | no |

Responsive behavior: navigation collapses to hamburger menu on mobile. Tables scroll horizontally on small screens.

## Dashboard Views

### BlockBima Admin Dashboard

- **Summary cards:** Total organizations, total contracts (all orgs), total premiums (all orgs), total settlements
- **Contracts by status chart:** Bar/pie chart showing Created vs. Deployed vs. Settled breakdown
- **Recent activity feed:** Latest contracts, recent settlements, new beneficiaries across all organizations
- **Quick links:** Manage organizations

### Lender Staff Dashboard

- **Summary cards:** Organization's contracts, beneficiaries, premiums collected, premiums owed
- **Contracts by status chart:** Breakdown for their organization only
- **Upcoming maturity dates:** Contracts approaching maturity
- **Reconciliation summary:** Collected vs. remitted overview
- **Quick link:** Detailed reconciliation page

### Insurer Staff Dashboard

- **Summary cards:** Total premiums across all lenders, total commissions, settled amounts
- **Premium breakdown by lender:** Table showing which lenders have paid, which owe
- **Recent settlements:** Latest settlements with blockchain transaction evidence
- **Reconciliation summary:** Received vs. expected overview

All dashboards use the same card and chart components — data is filtered by role and `org_id`.

## Detail Views

### Beneficiary Detail (`/beneficiaries/[id]`)

- **Header:** Name/ID, organization, gender, location (map pin with lat/lng)
- **Contracts table:** All contracts linked to this beneficiary (with status badges)
- **Onboarding history:** When onboarded, to which products

### Contract Detail (`/contracts/[id]`)

- **Header:** Contract ID, status badge (Created/Deployed/Settled), product name, region name
- **Key info grid:** Premium amount, maturity date, number of beneficiaries
- **Blockchain section (if deployed):** Smart contract address (truncated, copyable, linked to XRPL EVM explorer), deployment date
- **Settlement section (if settled):** Settlement amount, transaction ID (truncated, copyable, linked to appropriate block explorer), settlement date
- **Report info:** JSON data rendered as key-value pairs
- **Linked beneficiaries:** List of beneficiary IDs with links to their detail pages

### Product List (`/products`) — Read-only

Table with columns: Name, actuary, premium amount, currency, period length + type, report trigger. No edit or create functionality.

### Region List (`/regions`) — Read-only

Table with columns: Name, description, thresholds (each threshold shows product + value). No edit or create functionality.

## Reconciliation

### Lender View (`/reconciliation`)

- **Summary header:** Total premiums collected, total owed to insurer, outstanding balance
- **Contracts table:** Contract ID, product, beneficiaries count, premium amount, maturity date, status
- **Filters:** Status (created/deployed/settled), date range, product
- **Visual indicators:** Red/green for outstanding vs. paid
- **Export:** CSV/PDF statement of premiums collected and owed

### Insurer View (`/reconciliation`)

- **Summary header:** Total expected premiums, total received, commissions owed
- **Lender-grouped table:** Lender name, contract count, premiums collected, premiums owed, status
- **Drill-down:** Click a lender to see individual contracts
- **Evidence column:** Links to settlement transaction IDs on block explorer
- **Export:** CSV/PDF reconciliation report

Both views are read-only. Both support date range filtering ("as of" reporting). Both export to CSV and PDF.

## Error Handling

- **API errors:** Surface as toast notifications (shadcn toast)
- **403 (unauthorized for org):** "Access Denied" page with back-to-dashboard link
- **404:** Friendly not-found page
- **Network errors:** Retry prompt

## Loading States

- Skeleton loaders for all list and detail pages (shadcn provides skeleton components)
- Optimistic UI for tab switches and filter changes

## User & Organization Management (Admin Only)

### Organization List (`/organizations`)

Table with columns: Organization name, type (lender/insurer), number of users, number of contracts, created date. Clickable rows drill into org detail.

### Organization Detail (`/organizations/[id]`)

- **Header:** Org name, type, created date
- **Users table:** List of users in this org with name, email, role, last active
- **Add user:** Button to invite/add a new user to the organization (sets role and org assignment via Auth0)
- **Org stats:** Summary cards for contracts, beneficiaries, premiums tied to this org

## Cross-cutting Concerns

- All tables support cursor-based pagination matching the API's `pageToken`/`nextPageToken`
- Search and filter on list pages: beneficiaries by `externalId`, contracts by status/product/region
- Dark mode: not in scope for v1, but Tailwind setup makes it trivial to add later
- Responsive: sidebar collapses to hamburger on mobile, tables scroll horizontally
- Auth0 handles: login, logout, session refresh, profile display
