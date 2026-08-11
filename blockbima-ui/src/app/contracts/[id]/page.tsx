import { notFound, redirect } from "next/navigation";
import { requireAuth, canAccess } from "@/lib/auth";
import { api, type Beneficiary, type Contract, type DailyRainfall } from "@/lib/api-client";
import { getRainfallFeed } from "@/lib/rainfall-mock";
import { ContractDetail } from "@/components/contracts/contract-detail";

interface ContractDetailData {
  contract: Contract;
  beneficiaries: Beneficiary[];
  rainfallReadings: DailyRainfall[];
  threshold?: number;
}

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth();
  if (!canAccess(user, "contracts")) redirect("/access-denied");
  const { id } = await params;
  const data = await loadContractDetail(id);
  return (
    <ContractDetail
      contract={data.contract}
      beneficiaries={data.beneficiaries}
      rainfallReadings={data.rainfallReadings}
      threshold={data.threshold}
    />
  );
}

async function loadContractDetail(id: string): Promise<ContractDetailData> {
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

    return { contract, beneficiaries, rainfallReadings, threshold };
  } catch {
    notFound();
  }
}
