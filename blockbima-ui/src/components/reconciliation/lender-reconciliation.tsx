import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Contract } from "@/lib/api-client";
import { formatDate, statusLabel, statusVariant, formatCurrency } from "@/lib/utils";
import { ReconciliationSummary } from "./reconciliation-summary";

interface LenderReconciliationProps {
  contracts: Contract[];
  totalCollected: number;
  totalOwed: number;
}

export function LenderReconciliation({ contracts, totalCollected, totalOwed }: LenderReconciliationProps) {
  const outstanding = totalOwed - totalCollected;

  return (
    <div className="space-y-6">
      <ReconciliationSummary totalCollected={totalCollected} totalOwed={totalOwed} outstanding={outstanding} />
      <div>
        <h2 className="text-lg font-semibold">Contracts</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Premium</TableHead>
              <TableHead>Maturity</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs">{c.id.slice(0, 8)}...</TableCell>
                <TableCell>{c.productName}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(c.status)}>{statusLabel(c.status)}</Badge>
                </TableCell>
                <TableCell>{formatCurrency(c.totalPremium, "USD")}</TableCell>
                <TableCell className="text-sm">{formatDate(c.maturityDate)}</TableCell>
                <TableCell>
                  <Link href={`/contracts/${c.id}`} className="text-xs text-primary underline">
                    Details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
