import { LayoutDashboard, Users, FileText, Package, MapPin, Scale, Building2 } from "lucide-react";
import type { UserRole } from "@/lib/auth";
import { canAccess } from "@/lib/auth";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Beneficiaries", href: "/beneficiaries", icon: "Users" },
  { label: "Contracts", href: "/contracts", icon: "FileText" },
  { label: "Products", href: "/products", icon: "Package" },
  { label: "Regions", href: "/regions", icon: "MapPin" },
  { label: "Reconciliation", href: "/reconciliation", icon: "Scale" },
  { label: "Organizations", href: "/organizations", icon: "Building2" },
];

export function visibleNavItems(role: UserRole): NavItem[] {
  return navItems.filter((item) => {
    const fakeUser = { sub: "", email: "", name: "", org_id: "", role };
    return canAccess(fakeUser, item.href.replace("/", ""));
  });
}
