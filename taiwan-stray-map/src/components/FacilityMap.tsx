"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { Facility, FACILITY_TYPE_ICON, FACILITY_TYPE_LABELS } from "@/types/facility";

const MARKER_BG: Record<string, string> = {
  public_shelter: "#3b6fd6",
  dog_shelter: "#e0883f",
  private_rescue: "#e0883f",
  dog_cat_rescue: "#e0883f",
  animal_protection_association: "#2f8f5b",
  animal_welfare_organization: "#2f8f5b",
  foster_home: "#8a5fc9",
  foster_network: "#8a5fc9",
  other: "#8a8177",
};

function icon(f: Facility) {
  const bg = MARKER_BG[f.facility_type] ?? "#8a8177";
  const emoji = FACILITY_TYPE_ICON[f.facility_type];
  return L.divIcon({
    html: `<div style="background:${bg};width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.3);">${emoji}</div>`,
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

export default function FacilityMap({
  facilities,
  center = [23.6, 120.9],
  zoom = 8,
  height = "420px",
}: {
  facilities: Facility[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}) {
  const withCoords = facilities.filter((f) => typeof f.latitude === "number" && typeof f.longitude === "number");

  return (
    <div className="rounded-2xl overflow-hidden border border-border" style={{ height }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {withCoords.map((f) => (
          <Marker key={f.id} position={[f.latitude!, f.longitude!]} icon={icon(f)}>
            <Popup>
              <div className="text-sm">
                <div className="font-bold">{FACILITY_TYPE_ICON[f.facility_type]} {f.name}</div>
                <div className="text-xs text-gray-500">{FACILITY_TYPE_LABELS[f.facility_type]}</div>
                <Link href={`/facilities/${f.slug}`} className="text-blue-600 underline text-xs">
                  查看詳細資料
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {facilities.length > withCoords.length && (
        <div className="text-xs text-muted px-2 py-1 bg-chip">
          另有 {facilities.length - withCoords.length} 筆單位因尚無經緯度資料，暫未顯示於地圖上，可在下方列表查看。
        </div>
      )}
    </div>
  );
}
