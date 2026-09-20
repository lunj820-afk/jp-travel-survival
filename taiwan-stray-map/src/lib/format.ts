import { Facility } from "@/types/facility";

/** 資料完整度：純粹統計欄位是否已填寫，不是對單位的評分。 */
export function dataQuality(f: Facility): { percent: number; fields: { label: string; ok: boolean }[] } {
  const fields = [
    { label: "地址", ok: !!f.address },
    { label: "官方來源", ok: f.sources.some((s) => s.source_type === "government" || s.source_type === "official_website") },
    { label: "電話", ok: !!f.phone },
    { label: "認養資訊", ok: f.adoption_available !== "unknown" },
    { label: "志工資訊", ok: f.volunteer_available !== "unknown" },
    { label: "捐款資訊", ok: f.donation_available !== "unknown" },
    { label: "最後驗證日期", ok: f.sources.length > 0 && !!f.sources[0].verified_date },
  ];
  const okCount = fields.filter((x) => x.ok).length;
  return { percent: Math.round((okCount / fields.length) * 100), fields };
}

export function formatDate(iso?: string): string {
  if (!iso) return "尚未確認";
  return iso.replaceAll("-", "/");
}

export function daysSince(iso: string, today = "2026-09-20"): number {
  return Math.floor((new Date(today).getTime() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

export function latestVerifiedDate(f: Facility): string | undefined {
  if (!f.sources.length) return f.last_verified_at;
  return f.sources
    .map((s) => s.verified_date)
    .sort()
    .reverse()[0];
}
