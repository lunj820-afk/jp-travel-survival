import { Metadata } from "next";
import FacilityExplorer from "@/components/FacilityExplorer";
import { getAllFacilities } from "@/lib/facilities";

export const metadata: Metadata = {
  title: "全台地圖",
  description: "在地圖上瀏覽全台公立收容所、民間狗園、動物保護協會與中途之家。",
};

export default function MapPage() {
  const facilities = getAllFacilities();
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-black text-coffee">🗺 全台救援地圖</h1>
      <p className="text-sm text-muted">
        🔵 公立收容所　🟠 民間狗園／私人救援　🟢 動物保護協會／教育園區　🟣 中途之家 —— 圖示以形狀＋顏色雙重標示，避免色盲使用者無法判斷。
      </p>
      <FacilityExplorer facilities={facilities} showMap />
    </div>
  );
}
