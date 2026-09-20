import { Metadata } from "next";
import { Suspense } from "react";
import { filterFacilities } from "@/lib/facilities";
import FacilityExplorer from "@/components/FacilityExplorer";

export const metadata: Metadata = {
  title: "我要領養",
  description: "找一隻適合你的狗——瀏覽全台明確標示可認養或需聯絡確認的收容所與狗園。",
};

export default function AdoptionPage() {
  const adoptionFacilities = filterFacilities({ adoption: true });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-black text-coffee">🏠 找一隻適合你的狗</h1>
      <p className="text-sm text-muted">
        以下為官方或單位明確標示「可以認養」或「需事先聯絡」的收容所與狗園。目前網站尚未建立逐隻毛孩的個別檔案
        （年齡／體型／個性等），這部分需要單位或志工提供第一手資料才能上架，避免我們自行編造。
        建議直接聯絡單位詢問目前可認養的毛孩狀況。
      </p>
      <Suspense>
        <FacilityExplorer facilities={adoptionFacilities} />
      </Suspense>
    </div>
  );
}
