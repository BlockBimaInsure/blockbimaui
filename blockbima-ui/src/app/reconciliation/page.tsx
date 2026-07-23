import { requireAuth, canAccess } from "@/lib/auth";
import { redirect } from "next/navigation";
import { api } from "@/lib/api-client";
import { LenderReconciliation } from "@/components/reconciliation/lender-reconciliation";
import { InsurerReconciliation } from "@/components/reconciliation/insurer-reconciliation";

export default async function ReconciliationPage() {
  const user = await requireAuth();
  if (!canAccess(user, "reconciliation")) redirect("/access-denied");
  const { data: contracts } = await api.listContracts(user.org_id);

  const totalPremiums = contracts.reduce((sum, c) => sum + c.totalPremium, 0);
  const totalSettled = contracts
    .filter((c) => c.status === "CONTRACT_STATUS_SETTLED")
    .reduce((sum, c) => sum + (c.settlementAmount ?? 0), 0);

  if (user.role === "insurer") {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Reconciliation</h1>
        <InsurerReconciliation
          contracts={contracts}
          totalExpected={totalPremiums}
          totalReceived={totalSettled}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reconciliation</h1>
      <LenderReconciliation
        contracts={contracts}
        totalCollected={totalSettled}
        totalOwed={totalPremiums}
      />
    </div>
  );
}
