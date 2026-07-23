import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { InsuranceProduct } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";

interface ProductTableProps {
  products: InsuranceProduct[];
}

export function ProductTable({ products }: ProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Actuary</TableHead>
          <TableHead>Premium</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Period</TableHead>
          <TableHead>Report Trigger</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell>{p.actuary}</TableCell>
            <TableCell>{formatCurrency(p.premiumAmount, p.currency === "CURRENCY_KES" ? "KES" : "USD")}</TableCell>
            <TableCell>
              <Badge variant="outline">{p.currency.replace("CURRENCY_", "")}</Badge>
            </TableCell>
            <TableCell>
              {p.periodLength} {p.periodType.replace("PERIOD_TYPE_", "").toLowerCase()}
            </TableCell>
            <TableCell>{p.reportTrigger.replace("REPORT_TRIGGER_", "").toLowerCase()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
