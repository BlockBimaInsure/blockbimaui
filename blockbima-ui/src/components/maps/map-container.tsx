"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export interface MapMarker {
  id: string;
  lng: number;
  lat: number;
  label: string;
  color?: string;
  popup?: string;
}

interface MapContainerProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  style?: React.CSSProperties;
  onMarkerClick?: (id: string) => void;
}

export function MapContainer({
  markers = [],
  center = [37.9062, -1.2921],
  zoom = 6,
  className = "",
  style,
  onMarkerClick,
}: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center,
      zoom,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
    map.current.on("load", () => setLoaded(true));

    return () => {
      map.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loaded || !map.current) return;

    const existingMarkers = document.querySelectorAll(".maplibregl-marker");
    existingMarkers.forEach((m) => m.remove());

    markers.forEach((marker) => {
      const el = document.createElement("div");
      el.className = "marker";
      el.style.cssText = `
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: ${marker.color ?? "oklch(0.60 0.17 170)"};
        border: 2px solid white;
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.15s;
      `;
      el.onmouseenter = () => { el.style.transform = "scale(1.5)"; };
      el.onmouseleave = () => { el.style.transform = "scale(1)"; };
      el.onclick = () => onMarkerClick?.(marker.id);

      const popup = new maplibregl.Popup({ offset: 15 }).setHTML(
        `<div style="font-weight:500">${marker.label}</div>${marker.popup ? `<div style="color:#888;font-size:12px">${marker.popup}</div>` : ""}`
      );

      new maplibregl.Marker({ element: el })
        .setLngLat([marker.lng, marker.lat])
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [loaded, markers, onMarkerClick]);

  return (
    <div
      ref={mapContainer}
      className={`relative overflow-hidden rounded-xl border border-border ${className}`}
      style={style}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
