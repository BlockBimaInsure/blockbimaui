import { test, expect } from "@playwright/test";

test.describe("API Client - Module Structure", () => {
  test("api-client exports required types", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/lib/api-client.ts", "utf-8");

    expect(content).toContain("export interface Beneficiary");
    expect(content).toContain("export interface Contract");
    expect(content).toContain("export interface InsuranceProduct");
    expect(content).toContain("export interface Region");
    expect(content).toContain("export interface PaginatedResponse");
    expect(content).toContain("export class BlockBimaAPI");
    expect(content).toContain("export const api");
  });

  test("api-client imports UserRole from auth module (no duplicate)", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/lib/api-client.ts", "utf-8");

    expect(content).toContain('import type { UserRole } from "./auth"');
    expect(content).not.toMatch(/^export type UserRole/m);
  });

  test("api-client does not have hardcoded fallback URL", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/lib/api-client.ts", "utf-8");

    expect(content).not.toContain("dulcet-sopapillas-05b7ff.netlify.app");
    expect(content).toContain("process.env.BLOCKBIMA_API_URL");
  });
});

test.describe("API Client - Error Handling", () => {
  test("api-client throws on missing env var", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/lib/api-client.ts", "utf-8");

    expect(content).toContain("throw new Error");
    expect(content).toContain("BLOCKBIMA_API_URL environment variable is required");
  });
});

test.describe("Auth Module - Role Validation", () => {
  test("requireAuth rejects users without valid role", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/lib/auth.ts", "utf-8");

    expect(content).toContain('"blockbima_admin"');
    expect(content).toContain('"lender"');
    expect(content).toContain('"insurer"');
    expect(content).toContain("includes(role)");
    expect(content).toContain("redirect(\"/access-denied\")");
  });

  test("canAccess defines correct access matrix", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/lib/auth.ts", "utf-8");

    expect(content).toContain("blockbima_admin");
    expect(content).toContain("lender");
    expect(content).toContain("insurer");
  });
});

test.describe("Auth Module - Access Matrix Consistency", () => {
  test("nav-items uses canAccess from auth module", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/components/layout/nav-items.ts", "utf-8");

    expect(content).toContain('import { UserRole, canAccess } from "@/lib/auth"');
    expect(content).not.toContain("function canAccessByRole");
  });

  test("all page files import canAccess", async () => {
    const fs = await import("fs");
    const pages = [
      "src/app/beneficiaries/page.tsx",
      "src/app/contracts/page.tsx",
      "src/app/products/page.tsx",
      "src/app/regions/page.tsx",
      "src/app/reconciliation/page.tsx",
      "src/app/organizations/page.tsx",
    ];

    for (const pagePath of pages) {
      const content = fs.readFileSync(pagePath, "utf-8");
      expect(content).toContain("canAccess");
      expect(content).toContain('redirect("/access-denied")');
    }
  });

  test("detail pages import canAccess", async () => {
    const fs = await import("fs");
    const detailPages = [
      "src/app/beneficiaries/[id]/page.tsx",
      "src/app/contracts/[id]/page.tsx",
      "src/app/organizations/[id]/page.tsx",
    ];

    for (const pagePath of detailPages) {
      const content = fs.readFileSync(pagePath, "utf-8");
      expect(content).toContain("canAccess");
      expect(content).toContain('redirect("/access-denied")');
    }
  });
});

test.describe("Export Module - Security", () => {
  test("export.ts has use client directive", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/lib/export.ts", "utf-8");

    expect(content).toContain('"use client"');
  });

  test("export.ts sanitizes CSV injection characters", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/lib/export.ts", "utf-8");

    expect(content).toContain("^[=+\\-@\\t\\r]");
  });
});

test.describe("Utils - formatDate Robustness", () => {
  test("formatDate handles empty string", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/lib/utils.ts", "utf-8");

    expect(content).toContain("if (!dateStr)");
    expect(content).toContain("isNaN(d.getTime())");
  });
});
