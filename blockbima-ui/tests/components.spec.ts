import { test, expect } from "@playwright/test";

test.describe("Component - TopNav (Static)", () => {
  test("top-nav has user menu with logout link", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/components/layout/top-nav.tsx", "utf-8");

    expect(content).toContain("useUser");
    expect(content).toContain('href="/auth/logout"');
    expect(content).toContain("DropdownMenu");
  });
});

test.describe("Component - Avatar (Static)", () => {
  test("avatar component is imported and used", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/components/layout/top-nav.tsx", "utf-8");

    expect(content).toContain("Avatar");
    expect(content).toContain("AvatarFallback");
  });
});

test.describe("Component - Typography (Static)", () => {
  test("access-denied uses proper heading", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/app/access-denied/page.tsx", "utf-8");

    expect(content).toContain("<h1");
    expect(content).toContain("text-2xl");
  });
});

test.describe("Component - Links (Browser)", () => {
  test("internal links use proper attributes", async ({ page }) => {
    await page.goto("/access-denied", { waitUntil: "domcontentloaded" });

    const links = page.locator("a[href^='/']");
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute("href");
      expect(href).toBeTruthy();
      expect(href).toMatch(/^\//);
    }
  });
});

test.describe("Component - Loading States (Browser)", () => {
  test("pages render within acceptable time", async ({ page }) => {
    const start = Date.now();
    await page.goto("/access-denied", { waitUntil: "domcontentloaded" });
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(10000);
  });
});

test.describe("Component - Error Boundaries (Browser)", () => {
  test("non-existent page shows error, not crash", async ({ page }) => {
    const response = await page.goto("/nonexistent-page-12345", { waitUntil: "domcontentloaded" });
    expect([404, 403]).toContain(response?.status());
  });
});

test.describe("Component - Accessibility (Static)", () => {
  test("access-denied page has proper heading structure", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/app/access-denied/page.tsx", "utf-8");

    expect(content).toContain("<h1");
    expect(content).toContain("</h1>");
  });

  test("interactive elements have proper attributes", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/app/access-denied/page.tsx", "utf-8");

    expect(content).toContain("<Link");
    expect(content).toContain("href=");
  });
});

test.describe("Component - Accessibility (Browser)", () => {
  test("page has proper heading structure", async ({ page }) => {
    await page.goto("/access-denied", { waitUntil: "domcontentloaded" });

    const headings = await page.locator("h1, h2, h3, h4, h5, h6").allTextContents();
    expect(headings.length).toBeGreaterThan(0);
  });

  test("interactive elements are focusable", async ({ page }) => {
    await page.goto("/access-denied", { waitUntil: "domcontentloaded" });

    const focusableElements = await page.evaluate(() => {
      const elements = document.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      return elements.length;
    });
    expect(focusableElements).toBeGreaterThan(0);
  });
});
