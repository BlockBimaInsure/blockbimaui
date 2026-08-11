import { requireAuth, canAccess } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OrganizationTable } from "@/components/organizations/organization-table";
import type { Organization } from "@/components/organizations/organization-table";

export default async function OrganizationsPage() {
  const user = await requireAuth();
  if (!canAccess(user, "organizations")) redirect("/access-denied");

  const organizations: Organization[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Organizations</h1>
        <p className="text-sm text-muted-foreground">{organizations.length} total</p>
      </div>
      <OrganizationTable organizations={organizations} />
    </div>
  );
}
