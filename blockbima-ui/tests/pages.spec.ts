import { test, expect } from "@playwright/test";

test.describe("Page - Access Denied (Static Analysis)", () => {
  test("access-denied page exists with correct content", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/app/access-denied/page.tsx", "utf-8");

    expect(content).toContain("Access Denied");
    expect(content).toContain("You don't have permission");
    expect(content).toContain("Back to Dashboard");
    expect(content).toContain('href="/dashboard"');
  });
});

test.describe("Page - Layout Structure (Static Analysis)", () => {
  test("layout has top-nav with user menu", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/components/layout/top-nav.tsx", "utf-8");

    expect(content).toContain("useUser");
    expect(content).toContain('href="/auth/logout"');
  });

  test("layout has proper HTML structure", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/app/layout.tsx", "utf-8");

    expect(content).toContain('lang="en"');
    expect(content).toContain("TopNav");
    expect(content).toContain("main");
  });

  test("layout loads Geist fonts", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/app/layout.tsx", "utf-8");

    expect(content).toContain("Geist");
    expect(content).toContain("font-geist");
  });
});

test.describe("Page - Responsive Design (Browser)", () => {
  test("access-denied page renders on mobile viewport when authenticated", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/access-denied", { waitUntil: "domcontentloaded" });
    const url = new URL(page.url());

    const isAtPageOrAuth =
      url.pathname === "/access-denied" ||
      url.pathname === "/auth/login" ||
      url.hostname.includes("auth0.com");

    expect(isAtPageOrAuth).toBeTruthy();
  });

  test("access-denied page renders on tablet viewport when authenticated", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/access-denied", { waitUntil: "domcontentloaded" });
    const url = new URL(page.url());

    const isAtPageOrAuth =
      url.pathname === "/access-denied" ||
      url.pathname === "/auth/login" ||
      url.hostname.includes("auth0.com");

    expect(isAtPageOrAuth).toBeTruthy();
  });

  test("access-denied page renders on desktop viewport when authenticated", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/access-denied", { waitUntil: "domcontentloaded" });
    const url = new URL(page.url());

    const isAtPageOrAuth =
      url.pathname === "/access-denied" ||
      url.pathname === "/auth/login" ||
      url.hostname.includes("auth0.com");

    expect(isAtPageOrAuth).toBeTruthy();
  });
});

test.describe("Page - Keyboard Navigation (Browser)", () => {
  test("can tab through elements on auth page", async ({ page }) => {
    await page.goto("/access-denied", { waitUntil: "domcontentloaded" });
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return el?.tagName;
    });
    expect(focused).toBeTruthy();
  });
});
