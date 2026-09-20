import { Metadata } from "next";
import { Suspense } from "react";
import FacilityExplorer from "@/components/FacilityExplorer";
import { getAllFacilities } from "@/lib/facilities";

export const metadata: Metadata = {
  title: "單位列表",
  description: "搜尋並篩選全台公立收容所、民間狗園、動物保護協會與中途之家。",
};

export default function FacilitiesPage() {
  const facilities = getAllFacilities();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-black text-coffee">🔎 單位列表</h1>
      <Suspense>
        <FacilityExplorer facilities={facilities} />
      </Suspense>
    </div>
  );
}
