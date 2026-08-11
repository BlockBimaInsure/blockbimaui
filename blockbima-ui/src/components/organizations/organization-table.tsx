import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface Organization {
  id: string;
  name: string;
  type: string;
  userCount: number;
  contractCount: number;
  createdAt: string;
}

interface OrganizationTableProps {
  organizations: Organization[];
}

export function OrganizationTable({ organizations }: OrganizationTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Users</TableHead>
          <TableHead>Contracts</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations.map((org) => (
          <TableRow key={org.id}>
            <TableCell className="font-medium">{org.name}</TableCell>
            <TableCell>{org.type}</TableCell>
            <TableCell>{org.userCount}</TableCell>
            <TableCell>{org.contractCount}</TableCell>
            <TableCell>
              <Link href={`/organizations/${org.id}`} className="text-sm text-primary underline">
                View
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
