import { notFound, redirect } from "next/navigation";
import { requireAuth, canAccess } from "@/lib/auth";
import { api } from "@/lib/api-client";
import { BeneficiaryDetail } from "@/components/beneficiaries/beneficiary-detail";

export default async function BeneficiaryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth();
  if (!canAccess(user, "beneficiaries")) redirect("/access-denied");
  const { id } = await params;
  try {
    const beneficiary = await api.getBeneficiary(id);
    return <BeneficiaryDetail beneficiary={beneficiary} />;
  } catch {
    notFound();
  }
}
