import { notFound, redirect } from "next/navigation";
import { requireAuth, canAccess } from "@/lib/auth";
import { api } from "@/lib/api-client";
import { getRainfallFeed } from "@/lib/rainfall-mock";
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

    const rainfallReadings = contract.deployedAt
      ? await getRainfallFeed(
          contract.id,
          contract.deployedAt,
          contract.settledAt ?? new Date().toISOString().split("T")[0]
        )
      : [];

    const region = await api.listRegions();
    const regionData = region.data.find((r) => r.id === contract.regionId);
    const threshold = regionData?.thresholds.find((t) => t.productId === contract.productId)?.thresholdValue;

    return (
      <ContractDetail
        contract={contract}
        beneficiaries={beneficiaries}
        rainfallReadings={rainfallReadings}
        threshold={threshold}
      />
    );
  } catch {
    notFound();
  }
}
