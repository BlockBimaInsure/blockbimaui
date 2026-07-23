import { requireAuth } from "@/lib/auth";
import { api } from "@/lib/api-client";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { LenderDashboard } from "@/components/dashboard/lender-dashboard";
import { InsurerDashboard } from "@/components/dashboard/insurer-dashboard";

export default async function DashboardPage() {
  const user = await requireAuth();

  if (user.role === "blockbima_admin") {
    return <AdminDashboard orgCount={0} totalContracts={0} totalPremiums={0} totalSettled={0} />;
  }

  const { data: contracts, total: totalContracts } = await api.listContracts(user.org_id);
  const { total: totalBeneficiaries } = await api.listBeneficiaries(user.org_id);

  const premiumsCollected = contracts
    .filter((c) => c.status === "CONTRACT_STATUS_SETTLED")
    .reduce((sum, c) => sum + (c.settlementAmount ?? 0), 0);
  const premiumsOwed = contracts.reduce((sum, c) => sum + c.totalPremium, 0);
  const recentContracts = [...contracts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const recentSettlements = contracts
    .filter((c) => c.status === "CONTRACT_STATUS_SETTLED")
    .sort((a, b) => new Date(b.settledAt ?? 0).getTime() - new Date(a.settledAt ?? 0).getTime());

  if (user.role === "lender") {
    return (
      <LenderDashboard
        totalContracts={totalContracts}
        totalBeneficiaries={totalBeneficiaries}
        premiumsCollected={premiumsCollected}
        premiumsOwed={premiumsOwed}
        recentContracts={recentContracts}
      />
    );
  }

  return (
    <InsurerDashboard
      totalPremiums={premiumsOwed}
      totalCommissions={premiumsOwed - premiumsCollected}
      totalSettled={premiumsCollected}
      recentSettlements={recentSettlements}
    />
  );
}
