import { test, expect } from "@playwright/test";

test.describe("File Structure - Required Files", () => {
  const requiredFiles = [
    "src/proxy.ts",
    "src/lib/auth0.ts",
    "src/lib/auth.ts",
    "src/lib/api-client.ts",
    "src/lib/utils.ts",
    "src/lib/export.ts",
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/app/dashboard/page.tsx",
    "src/app/beneficiaries/page.tsx",
    "src/app/contracts/page.tsx",
    "src/app/products/page.tsx",
    "src/app/regions/page.tsx",
    "src/app/reconciliation/page.tsx",
    "src/app/organizations/page.tsx",
    "src/app/access-denied/page.tsx",
    "src/app/login/page.tsx",
    "src/components/layout/top-nav.tsx",
    "src/components/layout/nav-items.ts",
    "next.config.ts",
    "tsconfig.json",
    "package.json",
  ];

  for (const filePath of requiredFiles) {
    test(`required file exists: ${filePath}`, async () => {
      const fs = await import("fs");
      expect(fs.existsSync(filePath)).toBeTruthy();
    });
  }
});

test.describe("File Structure - No Deprecated Files", () => {
  test("middleware.ts does not exist at root", async () => {
    const fs = await import("fs");
    expect(fs.existsSync("middleware.ts")).toBeFalsy();
  });

  test("middleware.ts does not exist in src/", async () => {
    const fs = await import("fs");
    expect(fs.existsSync("src/middleware.ts")).toBeFalsy();
  });

  test("no /api/auth/ route handlers exist", async () => {
    const fs = await import("fs");
    expect(fs.existsSync("src/app/api")).toBeFalsy();
  });
});

test.describe("Config - next.config.ts", () => {
  test("has security headers", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("next.config.ts", "utf-8");

    expect(content).toContain("X-Frame-Options");
    expect(content).toContain("X-Content-Type-Options");
    expect(content).toContain("Referrer-Policy");
    expect(content).toContain("X-XSS-Protection");
  });
});

test.describe("Config - package.json", () => {
  test("has required dependencies", async () => {
    const fs = await import("fs");
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));

    expect(pkg.dependencies["@auth0/nextjs-auth0"]).toBeTruthy();
    expect(pkg.dependencies.next).toBeTruthy();
    expect(pkg.dependencies.react).toBeTruthy();
    expect(pkg.dependencies.shadcn).toBeTruthy();
  });

  test("does not have unused date-fns dependency", async () => {
    const fs = await import("fs");
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));

    expect(pkg.dependencies["date-fns"]).toBeUndefined();
  });

  test("has correct dev script", async () => {
    const fs = await import("fs");
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));

    expect(pkg.scripts.dev).toBe("next dev");
  });
});

test.describe("Config - tsconfig.json", () => {
  test("has path aliases configured", async () => {
    const fs = await import("fs");
    const tsconfig = JSON.parse(fs.readFileSync("tsconfig.json", "utf-8"));

    expect(tsconfig.compilerOptions.paths["@/*"]).toBeDefined();
  });
});

test.describe("Config - Auth0 Route Mounting", () => {
  test("proxy.ts references /auth/ routes not /api/auth/", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/proxy.ts", "utf-8");

    expect(content).toContain("/auth");
    expect(content).not.toContain("/api/auth");
  });

  test("top-nav logout link uses /auth/logout", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/components/layout/top-nav.tsx", "utf-8");

    expect(content).toContain("/auth/logout");
    expect(content).not.toContain("/api/auth/logout");
  });

  test("auth.ts redirect uses /auth/login", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/lib/auth.ts", "utf-8");

    expect(content).toContain('redirect("/auth/login")');
    expect(content).not.toContain('redirect("/")');
  });
});

test.describe("Config - Layout", () => {
  test("layout imports Auth0Provider", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/app/layout.tsx", "utf-8");

    expect(content).toContain("Auth0Provider");
    expect(content).toContain("@auth0/nextjs-auth0/client");
  });

  test("layout imports TopNav", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/app/layout.tsx", "utf-8");

    expect(content).toContain("TopNav");
  });

  test("layout has proper metadata", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("src/app/layout.tsx", "utf-8");

    expect(content).toContain("BlockBima");
    expect(content).toContain("description");
  });
});
