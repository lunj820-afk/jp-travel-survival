"use client";

import dynamic from "next/dynamic";
import { Facility } from "@/types/facility";

const FacilityMap = dynamic(() => import("./FacilityMap"), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-border bg-chip flex items-center justify-center text-muted text-sm" style={{ height: "420px" }}>
      地圖載入中…
    </div>
  ),
});

export default function FacilityMapLoader(props: {
  facilities: Facility[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}) {
  return <FacilityMap {...props} />;
}
