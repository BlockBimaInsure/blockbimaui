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
    return <ContractDetail contract={contract} />;
  } catch {
    notFound();
  }
}
