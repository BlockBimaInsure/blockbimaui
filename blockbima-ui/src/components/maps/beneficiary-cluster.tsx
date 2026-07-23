"use client";

import { MapContainer, MapMarker } from "./map-container";
import { Beneficiary } from "@/lib/api-client";
import { useRouter } from "next/navigation";

interface BeneficiaryClusterProps {
  beneficiaries: Beneficiary[];
  className?: string;
  compact?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  female: "oklch(0.65 0.17 330)",
  male: "oklch(0.60 0.17 170)",
};

export function BeneficiaryCluster({ beneficiaries, className, compact }: BeneficiaryClusterProps) {
  const router = useRouter();

  const markers: MapMarker[] = beneficiaries
    .filter((b) => b.latitude && b.longitude)
    .map((b) => ({
      id: b.id,
      lng: b.longitude,
      lat: b.latitude,
      label: b.externalId,
      color: STATUS_COLORS[b.gender] ?? "oklch(0.60 0.17 170)",
      popup: `${b.gender} · ${b.externalId}`,
    }));

  return (
    <MapContainer
      markers={markers}
      center={markers.length > 0 ? [markers[0].lng, markers[0].lat] : [37.9, -1.3]}
      zoom={compact ? 5 : 7}
      className={className}
      style={{ height: compact ? 200 : "100%", minHeight: compact ? 200 : 300 }}
      onMarkerClick={(id) => router.push(`/beneficiaries/${id}`)}
    />
  );
}
