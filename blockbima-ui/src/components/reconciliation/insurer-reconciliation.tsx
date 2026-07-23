import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Contract } from "@/lib/api-client";
import { formatDate, statusLabel, statusVariant, formatCurrency, truncateAddress, blockchainUrl } from "@/lib/utils";
import { ReconciliationSummary } from "./reconciliation-summary";
import { ExternalLink } from "lucide-react";

interface InsurerReconciliationProps {
  contracts: Contract[];
  totalExpected: number;
  totalReceived: number;
}

export function InsurerReconciliation({ contracts, totalExpected, totalReceived }: InsurerReconciliationProps) {
  const commissions = totalExpected - totalReceived;

  return (
    <div className="space-y-6">
      <ReconciliationSummary totalCollected={totalReceived} totalOwed={totalExpected} outstanding={commissions} />
      <div>
        <h2 className="text-lg font-semibold">All Contracts</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Premium</TableHead>
              <TableHead>Settlement</TableHead>
              <TableHead>Evidence</TableHead>
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
                <TableCell>
                  {c.settlementAmount !== undefined
                    ? formatCurrency(c.settlementAmount, "USD")
                    : "—"}
                </TableCell>
                <TableCell>
                  {c.settlementTransactionId ? (
                    <a
                      href={blockchainUrl("tx", c.settlementTransactionId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                    >
                      {truncateAddress(c.settlementTransactionId, 6)}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
