# BlockBimaUI Brainstorming Document

## Project Goal
Design and build a web-based UI for the BlockBima insurance platform.

## Key Decisions
- **Authentication:** Auth0 (integrating with BlockBima backend)
- **AI Model for Spec/Plan:** Kimi 3
- **Design Process:** Superpowers brainstorming skill

---

## API Summary (4 Services)

### 1. Beneficiaries Service
- `GET /beneficiary-management/v1/beneficiaries` — List with pagination, organization filter, readMask
- `GET /beneficiary-management/v1/beneficiaries/{id}` — Get single beneficiary
- `POST /beneficiary-management/v1/onboard` — Onboard single (beneficiaryId, productId, lat/lng, units)
- `POST /beneficiary-management/v1/bulk-onboard` — Bulk upload via file URL + productId

**Beneficiary fields:** id, organizationId, externalId, gender, longitude, latitude, createdAt, updatedAt

### 2. Contracts Service
- `GET /contract-management/v1/contracts` — List with filters (org, product, region, status), pagination
- `GET /contract-management/v1/contracts/{id}` — Get single contract

**Contract fields:** id, organizationId, productId, productName, regionId, regionName, beneficiaries[], status (CREATED/DEPLOYED/SETTLED), totalPremium, maturityDate, smartContractAddress, deployedAt, settledAt, settlementAmount, settlementTransactionId, reportInfo (JSON), createdAt, updatedAt

**Key concept:** Contracts link products to regions, contain beneficiaries, track blockchain deployment and settlement.

### 3. Products Service
- `GET /product-management/v1/insurance-products` — List with actuary filter, includeDeleted, fields mask

**Product fields:** id, name, premiumAmount, actuary, reportDataset (JSON), currency (USD/KES), periodLength, periodType (DAYS/WEEKS/MONTHS/YEARS), reportTrigger (MATURITY/OCCURRENCE/INTERVAL), createdAt, updatedAt, deletedAt, isDeleted

### 4. Regions Service
- `GET /region-management/v1/regions` — List with pagination, readMask

**Region fields:** id, name, description, thresholds[] (each: productId + thresholdValue)

---

## What We Know
- This is a parametric/blockchain-based insurance platform
- Contracts are deployed as smart contracts (42-char address)
- Settlements happen on-chain (66-char transaction ID)
- Products support multiple currencies (USD, KES)
- Regions have per-product thresholds (likely for weather/disaster triggers)
- Beneficiaries have geolocation data
- Reports are dynamically typed (JSON structs)
- API is gRPC-translated to REST (protobuf schemas, field masks)

## What We Need to Determine
- Target users and their primary workflows
- Scope of UI (admin dashboard? end-user portal? both?)
- Key features and prioritization
- Visual direction and design system
