import { test, expect } from "@playwright/test";

test.describe("Security Headers (File Config)", () => {
  test("next.config.ts defines X-Frame-Options", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("next.config.ts", "utf-8");
    expect(content).toContain("X-Frame-Options");
    expect(content).toContain("DENY");
  });

  test("next.config.ts defines X-Content-Type-Options", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("next.config.ts", "utf-8");
    expect(content).toContain("X-Content-Type-Options");
    expect(content).toContain("nosniff");
  });

  test("next.config.ts defines Referrer-Policy", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("next.config.ts", "utf-8");
    expect(content).toContain("Referrer-Policy");
    expect(content).toContain("strict-origin-when-cross-origin");
  });

  test("next.config.ts defines X-XSS-Protection", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("next.config.ts", "utf-8");
    expect(content).toContain("X-XSS-Protection");
    expect(content).toContain("1; mode=block");
  });
});

test.describe("Security - Content Leaks", () => {
  test("no sensitive data in 404 page HTML", async ({ request }) => {
    const response = await request.get("/nonexistent-xyz-12345");
    const body = await response.text();

    expect(body).not.toContain("AUTH0_SECRET");
    expect(body).not.toContain("AUTH0_CLIENT_SECRET");
    expect(body).not.toContain("BLOCKBIMA_API_URL");
  });

  test("next.config.ts disables X-Powered-By header", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("next.config.ts", "utf-8");
    expect(content).toContain("poweredByHeader");
    expect(content).toContain("false");
  });
});

test.describe("Security - Auth Flow", () => {
  test("protected route redirects without leaking session", async ({ request }) => {
    const response = await request.get("/dashboard", { maxRedirects: 0 });
    const headers = response.headers();

    expect([301, 302, 303, 307, 308]).toContain(response.status());
    expect(headers["location"]).toBeTruthy();
    expect(headers["location"]).not.toContain("AUTH0_SECRET");
  });

  test("auth callback URL is properly configured", async () => {
    const fs = await import("fs");
    const env = fs.readFileSync(".env.local", "utf-8");

    expect(env).toContain("AUTH0_BASE_URL=http://localhost:3001");
  });
});
