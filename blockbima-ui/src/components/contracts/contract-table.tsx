import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Contract } from "@/lib/api-client";
import { formatDate, statusLabel, statusVariant, formatCurrency } from "@/lib/utils";

interface ContractTableProps {
  contracts: Contract[];
}

export function ContractTable({ contracts }: ContractTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Region</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Premium</TableHead>
          <TableHead>Maturity</TableHead>
          <TableHead>Beneficiaries</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contracts.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-medium">{c.productName}</TableCell>
            <TableCell>{c.regionName}</TableCell>
            <TableCell>
              <Badge variant={statusVariant(c.status)}>{statusLabel(c.status)}</Badge>
            </TableCell>
            <TableCell>{formatCurrency(c.totalPremium, "USD")}</TableCell>
            <TableCell className="text-sm">{formatDate(c.maturityDate)}</TableCell>
            <TableCell className="text-sm">{c.beneficiaries.length}</TableCell>
            <TableCell>
              <Link href={`/contracts/${c.id}`} className="text-sm text-primary underline">
                View
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
