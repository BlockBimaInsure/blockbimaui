import { test, expect } from "@playwright/test";

test.describe("Proxy - Route Matching", () => {
  test("proxy config matcher excludes static files", async () => {
    const fs = await import("fs");
    const proxyContent = fs.readFileSync("src/proxy.ts", "utf-8");

    expect(proxyContent).toContain("_next/static");
    expect(proxyContent).toContain("_next/image");
    expect(proxyContent).toContain("favicon.ico");
  });

  test("proxy handles auth routes differently from protected routes", async () => {
    const fs = await import("fs");
    const proxyContent = fs.readFileSync("src/proxy.ts", "utf-8");

    expect(proxyContent).toContain("/auth");
    expect(proxyContent).toContain("getSession");
  });
});

test.describe("Proxy - Auth0 Configuration", () => {
  test("Auth0 env vars are set", async () => {
    const fs = await import("fs");
    const envContent = fs.readFileSync(".env.local", "utf-8");

    expect(envContent).toContain("AUTH0_SECRET=");
    expect(envContent).toContain("AUTH0_BASE_URL=");
    expect(envContent).toContain("AUTH0_DOMAIN=");
    expect(envContent).toContain("AUTH0_CLIENT_ID=");
    expect(envContent).toContain("AUTH0_CLIENT_SECRET=");
    expect(envContent).toContain("BLOCKBIMA_API_URL=");
  });

  test("AUTH0_BASE_URL points to localhost:3001", async () => {
    const fs = await import("fs");
    const envContent = fs.readFileSync(".env.local", "utf-8");

    expect(envContent).toContain("localhost:3001");
  });

  test("Auth0 client is properly initialized", async () => {
    const fs = await import("fs");
    const auth0Content = fs.readFileSync("src/lib/auth0.ts", "utf-8");

    expect(auth0Content).toContain("Auth0Client");
    expect(auth0Content).toContain("new Auth0Client()");
  });
});

test.describe("Proxy - Response Behavior", () => {
  test("returns 307 for root redirect", async ({ request }) => {
    const response = await request.get("/", { maxRedirects: 0 });
    expect(response.status()).toBe(307);
  });

  test("returns redirect for unauthenticated /dashboard", async ({ request }) => {
    const response = await request.get("/dashboard", { maxRedirects: 0 });
    expect([301, 302, 303, 307, 308]).toContain(response.status());
  });

  test("returns 302/307 redirect to auth for protected pages", async ({ request }) => {
    const routes = ["/beneficiaries", "/contracts", "/products", "/regions", "/reconciliation"];

    for (const route of routes) {
      const response = await request.get(route, { maxRedirects: 0 });
      expect([301, 302, 303, 307, 308]).toContain(response.status());
    }
  });

  test("/auth/login returns auth flow response (not 404)", async ({ request }) => {
    const response = await request.get("/auth/login", { maxRedirects: 0 });
    expect(response.status()).not.toBe(404);
  });
});

test.describe("Proxy - Content Security", () => {
  test("no sensitive data leaked in error responses", async ({ request }) => {
    const response = await request.get("/nonexistent-page-xyz");
    const body = await response.text();

    expect(body).not.toContain("AUTH0_SECRET");
    expect(body).not.toContain("AUTH0_CLIENT_SECRET");
    expect(body).not.toContain("BLOCKBIMA_API_URL");
  });

  test("proxy doesn't expose server internals", async ({ request }) => {
    const response = await request.get("/nonexistent-page-xyz");
    const headers = response.headers();

    expect(headers["x-powered-by"]).toBeFalsy();
  });
});
