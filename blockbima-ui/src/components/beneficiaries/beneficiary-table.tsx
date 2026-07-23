import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Beneficiary } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

interface BeneficiaryTableProps {
  beneficiaries: Beneficiary[];
}

export function BeneficiaryTable({ beneficiaries }: BeneficiaryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>External ID</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Created</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {beneficiaries.map((b) => (
          <TableRow key={b.id}>
            <TableCell className="font-mono text-sm">{b.externalId}</TableCell>
            <TableCell>
              <Badge variant="outline">{b.gender || "—"}</Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {b.latitude.toFixed(4)}, {b.longitude.toFixed(4)}
            </TableCell>
            <TableCell className="text-sm">{formatDate(b.createdAt)}</TableCell>
            <TableCell>
              <Link href={`/beneficiaries/${b.id}`} className="text-sm text-primary underline">
                View
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
