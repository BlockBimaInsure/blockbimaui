import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Beneficiary } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

interface BeneficiaryDetailProps {
  beneficiary: Beneficiary;
}

export function BeneficiaryDetail({ beneficiary }: BeneficiaryDetailProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Beneficiary {beneficiary.externalId}</h1>
        <p className="text-sm text-muted-foreground">ID: {beneficiary.id}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gender</span>
              <span>{beneficiary.gender || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Organization ID</span>
              <span className="font-mono text-xs">{beneficiary.organizationId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{formatDate(beneficiary.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Updated</span>
              <span>{formatDate(beneficiary.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Latitude</span>
              <span>{beneficiary.latitude}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Longitude</span>
              <span>{beneficiary.longitude}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
