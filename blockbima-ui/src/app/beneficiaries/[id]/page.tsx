import { notFound, redirect } from "next/navigation";
import { requireAuth, canAccess } from "@/lib/auth";
import { api, type Beneficiary } from "@/lib/api-client";
import { BeneficiaryDetail } from "@/components/beneficiaries/beneficiary-detail";

export default async function BeneficiaryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth();
  if (!canAccess(user, "beneficiaries")) redirect("/access-denied");
  const { id } = await params;
  const beneficiary = await fetchBeneficiary(id);
  return <BeneficiaryDetail beneficiary={beneficiary} />;
}

async function fetchBeneficiary(id: string): Promise<Beneficiary> {
  try {
    return await api.getBeneficiary(id);
  } catch {
    notFound();
  }
}
