import { notFound, redirect } from "next/navigation";
import { requireAuth, canAccess } from "@/lib/auth";
import { api } from "@/lib/api-client";
import { ContractDetail } from "@/components/contracts/contract-detail";

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth();
  if (!canAccess(user, "contracts")) redirect("/access-denied");
  const { id } = await params;
  try {
    const contract = await api.getContract(id);
    const beneficiaries = await Promise.all(
      contract.beneficiaries.map((bId) => api.getBeneficiary(bId))
    );
    return <ContractDetail contract={contract} beneficiaries={beneficiaries} />;
  } catch {
    notFound();
  }
}
