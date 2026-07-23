import { auth0 } from "./auth0";
import { redirect } from "next/navigation";

export type UserRole = "blockbima_admin" | "lender" | "insurer";

export interface AuthUser {
  sub: string;
  email: string;
  name: string;
  org_id: string;
  role: UserRole;
}

export async function requireAuth(): Promise<AuthUser> {
  const session = await auth0.getSession();
  if (!session || !session.user) {
    redirect("/auth/login");
  }
  const role = session.user.role as UserRole | undefined;
  if (!role || !["blockbima_admin", "lender", "insurer"].includes(role)) {
    redirect("/access-denied");
  }
  return {
    sub: session.user.sub,
    email: session.user.email ?? "",
    name: session.user.name ?? "",
    org_id: session.user.org_id ?? "",
    role,
  };
}

export function hasRole(user: AuthUser, role: UserRole): boolean {
  return user.role === role;
}

export function canAccess(user: AuthUser, resource: string): boolean {
  const roleAccess: Record<UserRole, string[]> = {
    blockbima_admin: ["dashboard", "beneficiaries", "contracts", "products", "regions", "organizations"],
    lender: ["dashboard", "beneficiaries", "contracts", "products", "regions", "reconciliation"],
    insurer: ["dashboard", "products", "regions", "reconciliation"],
  };
  return roleAccess[user.role]?.includes(resource) ?? false;
}
