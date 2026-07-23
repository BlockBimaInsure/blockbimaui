import { requireAuth, canAccess } from "@/lib/auth";
import { redirect } from "next/navigation";
import { api } from "@/lib/api-client";
import { RegionTable } from "@/components/regions/region-table";
import { RegionMap } from "@/components/maps/region-map";

export default async function RegionsPage() {
  const user = await requireAuth();
  if (!canAccess(user, "regions")) redirect("/access-denied");
  const { data: regions, total } = await api.listRegions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Regions</h1>
        <p className="text-sm text-muted-foreground">{total} total</p>
      </div>
      <div className="mb-6">
        <RegionMap regions={regions} className="h-[300px]" />
      </div>
      <RegionTable regions={regions} />
    </div>
  );
}
