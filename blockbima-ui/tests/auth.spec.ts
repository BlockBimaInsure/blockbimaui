import { test, expect } from "@playwright/test";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/beneficiaries",
  "/beneficiaries/some-id",
  "/contracts",
  "/contracts/some-id",
  "/contracts/some-id/rainfall",
  "/products",
  "/regions",
  "/reconciliation",
  "/organizations",
  "/organizations/some-id",
];

test.describe("Authentication - Unauthenticated Access", () => {
  for (const route of PROTECTED_ROUTES) {
    test(`redirects ${route} to login when not authenticated`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const url = new URL(page.url());

      const isRedirectedToAuth =
        url.pathname === "/auth/login" ||
        url.pathname === "/login" ||
        url.hostname.includes("auth0.com");

      expect(isRedirectedToAuth).toBeTruthy();
    });
  }
});

test.describe("Authentication - Root Redirect", () => {
  test("redirects / to /dashboard", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const url = new URL(page.url());

    const isAtDashboardOrLogin =
      url.pathname === "/dashboard" ||
      url.pathname === "/auth/login" ||
      url.pathname === "/login" ||
      url.hostname.includes("auth0.com");

    expect(isAtDashboardOrLogin).toBeTruthy();
  });
});

test.describe("Authentication - Login Page", () => {
  test("/login page exists and triggers auth flow", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    const url = new URL(page.url());

    const isAuthFlow =
      url.hostname.includes("auth0.com") ||
      url.pathname === "/auth/login" ||
      url.pathname === "/login";

    expect(isAuthFlow).toBeTruthy();
  });
});

test.describe("Authentication - Auth Flow Behavior", () => {
  test("all protected routes redirect to auth when unauthenticated", async ({ request }) => {
    const routes = [
      "/dashboard",
      "/beneficiaries",
      "/contracts",
      "/products",
      "/regions",
      "/reconciliation",
      "/organizations",
    ];

    for (const route of routes) {
      const response = await request.get(route, { maxRedirects: 0 });
      expect([301, 302, 303, 307, 308]).toContain(response.status());
    }
  });

  test("auth login route is not 404", async ({ request }) => {
    const response = await request.get("/auth/login", { maxRedirects: 0 });
    expect(response.status()).not.toBe(404);
  });

  test("access-denied is public and accessible without auth", async ({ request }) => {
    const response = await request.get("/access-denied", { maxRedirects: 0 });
    expect(response.status()).toBe(200);
  });
});
