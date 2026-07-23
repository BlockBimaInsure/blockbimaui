import { requireAuth, canAccess } from "@/lib/auth";
import { redirect } from "next/navigation";
import { api } from "@/lib/api-client";
import { ContractTable } from "@/components/contracts/contract-table";

export default async function ContractsPage() {
  const user = await requireAuth();
  if (!canAccess(user, "contracts")) redirect("/access-denied");
  const { data: contracts, total } = await api.listContracts(user.org_id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contracts</h1>
        <p className="text-sm text-muted-foreground">{total} total</p>
      </div>
      <ContractTable contracts={contracts} />
    </div>
  );
}
