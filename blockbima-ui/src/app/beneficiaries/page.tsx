import { requireAuth, canAccess } from "@/lib/auth";
import { redirect } from "next/navigation";
import { api } from "@/lib/api-client";
import { BeneficiaryTable } from "@/components/beneficiaries/beneficiary-table";

export default async function BeneficiariesPage() {
  const user = await requireAuth();
  if (!canAccess(user, "beneficiaries")) redirect("/access-denied");
  const { data: beneficiaries, total } = await api.listBeneficiaries(user.org_id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Beneficiaries</h1>
        <p className="text-sm text-muted-foreground">{total} total</p>
      </div>
      <BeneficiaryTable beneficiaries={beneficiaries} />
    </div>
  );
}
