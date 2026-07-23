"use client";

import { MapContainer, MapMarker } from "./map-container";
import { Region } from "@/lib/api-client";

interface RegionMapProps {
  regions: Region[];
  className?: string;
}

const REGION_CENTERS: Record<string, [number, number]> = {
  "East Africa": [37.9, -1.3],
  "West Africa": [-1.2, 6.5],
  "Southern Africa": [25.0, -29.0],
  "North Africa": [10.0, 30.0],
  "Central Africa": [18.0, 0.0],
  Default: [20.0, 5.0],
};

export function RegionMap({ regions, className }: RegionMapProps) {
  const markers: MapMarker[] = regions.map((r) => {
    const center = REGION_CENTERS[r.name] ?? REGION_CENTERS.Default;
    return {
      id: r.id,
      lng: center[0],
      lat: center[1],
      label: r.name,
      color: "oklch(0.60 0.17 170)",
      popup: r.description || `${r.thresholds.length} product thresholds`,
    };
  });

  return (
    <MapContainer
      markers={markers}
      center={[20.0, 5.0]}
      zoom={3}
      className={className}
      style={{ height: "100%", minHeight: 300 }}
    />
  );
}
