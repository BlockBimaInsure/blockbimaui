import { UserRole, canAccess } from "@/lib/auth";

export interface NavItem {
  label: string;
  href: string;
  resource: string;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", resource: "dashboard" },
  { label: "Beneficiaries", href: "/beneficiaries", resource: "beneficiaries" },
  { label: "Contracts", href: "/contracts", resource: "contracts" },
  { label: "Products", href: "/products", resource: "products" },
  { label: "Regions", href: "/regions", resource: "regions" },
  { label: "Reconciliation", href: "/reconciliation", resource: "reconciliation" },
  { label: "Organizations", href: "/organizations", resource: "organizations" },
];

export function visibleNavItems(role: UserRole): NavItem[] {
  return navItems.filter((item) => {
    const fakeUser = { sub: "", email: "", name: "", org_id: "", role };
    return canAccess(fakeUser, item.resource);
  });
}
