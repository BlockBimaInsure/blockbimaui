import { requireAuth, canAccess } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OrganizationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth();
  if (!canAccess(user, "organizations")) redirect("/access-denied");
  const { id } = await params;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Organization Detail</h1>
      <p className="text-muted-foreground">Organization: {id}</p>
    </div>
  );
}
