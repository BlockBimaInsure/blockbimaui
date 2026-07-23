import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Contract } from "@/lib/api-client";
import { formatDate, statusLabel, statusVariant, formatCurrency } from "@/lib/utils";
import { BlockchainLinks } from "./blockchain-links";
import { BeneficiaryCluster } from "@/components/maps/beneficiary-cluster";
import { Beneficiary } from "@/lib/api-client";

interface ContractDetailProps {
  contract: Contract;
  beneficiaries?: Beneficiary[];
}

export function ContractDetail({ contract, beneficiaries = [] }: ContractDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contract</h1>
          <p className="font-mono text-sm text-muted-foreground">{contract.id}</p>
        </div>
        <Badge variant={statusVariant(contract.status)} className="text-sm">
          {statusLabel(contract.status)}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product</span>
              <span className="font-medium">{contract.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Region</span>
              <span>{contract.regionName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Premium</span>
              <span className="font-medium">{formatCurrency(contract.totalPremium, "USD")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Maturity Date</span>
              <span>{formatDate(contract.maturityDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Beneficiaries</span>
              <span>{contract.beneficiaries.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Blockchain</CardTitle>
          </CardHeader>
          <CardContent>
            <BlockchainLinks
              smartContractAddress={contract.smartContractAddress}
              deployedAt={contract.deployedAt}
              settlementTransactionId={contract.settlementTransactionId}
              settlementAmount={contract.settlementAmount}
              settledAt={contract.settledAt}
            />
            {!contract.smartContractAddress && (
              <p className="text-sm text-muted-foreground">Not yet deployed</p>
            )}
          </CardContent>
        </Card>
      </div>

      {contract.beneficiaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Beneficiaries ({contract.beneficiaries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {contract.beneficiaries.map((bId) => (
                <Link
                  key={bId}
                  href={`/beneficiaries/${bId}`}
                  className="rounded-md border px-3 py-1 text-xs font-mono text-primary hover:bg-muted"
                >
                  {bId.slice(0, 8)}...
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {beneficiaries.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Beneficiary Locations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <BeneficiaryCluster beneficiaries={beneficiaries} className="h-[350px]" />
          </CardContent>
        </Card>
      )}

      {contract.reportInfo && Object.keys(contract.reportInfo).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Report Info</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-1 text-sm">
              {Object.entries(contract.reportInfo).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <dt className="text-muted-foreground">{key}</dt>
                  <dd className="font-mono">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
