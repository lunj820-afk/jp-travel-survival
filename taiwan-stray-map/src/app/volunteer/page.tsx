import { Metadata } from "next";
import { filterFacilities } from "@/lib/facilities";
import FacilityExplorer from "@/components/FacilityExplorer";

export const metadata: Metadata = {
  title: "我要當志工",
  description: "找附近的志工機會——瀏覽全台明確標示接受志工的收容所與狗園。",
};

const SKILL_TAGS = ["遛狗", "洗澡", "清潔", "餵食", "拍照", "社群宣傳", "活動支援", "接送", "中途", "攝影", "影片", "獸醫", "護理", "設計", "行銷", "網站", "法律"];

export default function VolunteerPage() {
  const volunteerFacilities = filterFacilities({ volunteer: true });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-black text-coffee">🙋 找附近的志工機會</h1>
      <p className="text-sm text-muted">以下為明確標示接受志工，或需事先聯絡確認的單位。</p>
      <div className="flex flex-wrap gap-1.5">
        {SKILL_TAGS.map((tag) => (
          <span key={tag} className="badge badge-gray">{tag}</span>
        ))}
      </div>
      <p className="text-xs text-muted">
        各單位需要的志工技能差異很大，目前網站尚未逐一記錄每個單位具體需要的志工類型，請直接聯絡單位詢問。
      </p>
      <FacilityExplorer facilities={volunteerFacilities} />
    </div>
  );
}
