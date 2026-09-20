import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getAllFacilities, getActiveSupplyNeeds } from "@/lib/facilities";
import FacilityExplorer from "@/components/FacilityExplorer";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "物資需求",
  description: "查看全台收容所與狗園最近需要的飼料、罐頭與清潔用品，並找到接受捐款或物資的單位。",
};

export default function DonationPage() {
  const facilities = getAllFacilities().filter(
    (f) =>
      f.donation_available === "yes" ||
      f.donation_available === "conditional" ||
      f.supplies_available === "yes" ||
      f.supplies_available === "conditional"
  );
  const needs = getActiveSupplyNeeds();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-black text-coffee">❤️ 幫助浪浪</h1>

      <section>
        <h2 className="font-bold text-coffee mb-2">🥫 最近需要什麼？</h2>
        {needs.length === 0 ? (
          <p className="text-sm text-muted">
            目前資料庫尚未收到任何單位回報明確的物資需求。物資需求會隨單位實際狀況變動，我們不會自行猜測，
            待單位或志工回報後才會上架，並清楚標示更新日期。
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {needs.map((n, i) => (
              <Link key={i} href={`/facilities/${n.facilitySlug}`} className="card p-3 text-sm block">
                <div className="font-semibold text-coffee">{n.item} · {n.facilityName}</div>
                <div className="text-xs text-muted">
                  最後更新：{formatDate(n.updated_at)}
                  {n.isStale && <span style={{ color: "var(--status-orange)" }}> · ⚠️ 需求可能已過期，請聯絡單位確認</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-bold text-coffee mb-2">接受捐款／物資的單位</h2>
        <Suspense>
          <FacilityExplorer facilities={facilities} />
        </Suspense>
      </section>
    </div>
  );
}
