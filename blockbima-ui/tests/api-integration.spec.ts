import { test, expect } from "@playwright/test";

const API_BASE = "https://dulcet-sopapillas-05b7ff.netlify.app";

test.describe("API - External Service Reachability", () => {
  test("BlockBima API base domain is reachable", async ({ request }) => {
    const response = await request.get(API_BASE, { timeout: 15000 });
    expect(response.status()).toBeLessThan(500);
  });

  test("BlockBima API products endpoint returns data or clear error", async ({ request }) => {
    const response = await request.get(
      `${API_BASE}/product-management/v1/insurance-products`,
      { timeout: 15000 }
    );
    const contentType = response.headers()["content-type"] || "";

    if (response.status() === 200 && contentType.includes("json")) {
      const body = await response.json();
      expect(body).toHaveProperty("insuranceProducts");
      expect(Array.isArray(body.insuranceProducts)).toBeTruthy();
    } else {
      expect([200, 404, 503]).toContain(response.status());
    }
  });

  test("BlockBima API regions endpoint returns data or clear error", async ({ request }) => {
    const response = await request.get(
      `${API_BASE}/region-management/v1/regions`,
      { timeout: 15000 }
    );
    const contentType = response.headers()["content-type"] || "";

    if (response.status() === 200 && contentType.includes("json")) {
      const body = await response.json();
      expect(body).toHaveProperty("regions");
      expect(Array.isArray(body.regions)).toBeTruthy();
    } else {
      expect([200, 404, 503]).toContain(response.status());
    }
  });

  test("BlockBima API returns HTML error page for unknown routes (not crash)", async ({ request }) => {
    const response = await request.get(`${API_BASE}/nonexistent`, { timeout: 15000 });
    expect(response.status()).toBe(404);
  });
});

test.describe("API - Auth0 Domain Reachability", () => {
  test("Auth0 OIDC discovery endpoint is accessible", async ({ request }) => {
    const response = await request.get(
      "https://dev-750g0pvvyzusyj31.us.auth0.com/.well-known/openid-configuration",
      { timeout: 15000 }
    );
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.issuer).toContain("dev-750g0pvvyzusyj31.us.auth0.com");
    expect(body.authorization_endpoint).toBeTruthy();
    expect(body.token_endpoint).toBeTruthy();
  });

  test("Auth0 JWKS endpoint is accessible", async ({ request }) => {
    const configResponse = await request.get(
      "https://dev-750g0pvvyzusyj31.us.auth0.com/.well-known/openid-configuration",
      { timeout: 15000 }
    );
    const config = await configResponse.json();

    const jwksResponse = await request.get(config.jwks_uri, { timeout: 15000 });
    expect(jwksResponse.status()).toBe(200);

    const jwks = await jwksResponse.json();
    expect(jwks).toHaveProperty("keys");
    expect(Array.isArray(jwks.keys)).toBeTruthy();
  });
});
