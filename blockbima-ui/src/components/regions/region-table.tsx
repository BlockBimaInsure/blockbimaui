import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Region } from "@/lib/api-client";

interface RegionTableProps {
  regions: Region[];
}

export function RegionTable({ regions }: RegionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Thresholds</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {regions.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">{r.name}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{r.description || "—"}</TableCell>
            <TableCell className="text-sm">{r.thresholds.length} product thresholds</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
