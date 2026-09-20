import Link from "next/link";
import { getMergedFacilities } from "@/lib/adminStore";
import { listReports } from "@/lib/reportStore";
import { getStats, getVerificationBuckets } from "@/lib/facilities";

export default async function AdminHome() {
  const facilities = await getMergedFacilities();
  const reports = await listReports();
  const stats = getStats(facilities);
  const buckets = getVerificationBuckets(facilities);
  const pending = reports.filter((r) => r.status === "pending");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card p-4"><div className="text-2xl font-bold text-coffee">{stats.total}</div><div className="text-xs text-muted">總單位數</div></div>
        <div className="card p-4"><div className="text-2xl font-bold text-coffee">{buckets.verified}</div><div className="text-xs text-muted">已驗證</div></div>
        <div className="card p-4"><div className="text-2xl font-bold text-coffee">{buckets.needs_verification}</div><div className="text-xs text-muted">待確認</div></div>
        <div className="card p-4"><div className="text-2xl font-bold text-coffee">{pending.length}</div><div className="text-xs text-muted">待處理回報</div></div>
      </div>

      <div className="card p-4">
        <h2 className="font-bold text-coffee mb-2">最近使用者回報</h2>
        {pending.length === 0 ? (
          <p className="text-sm text-muted">目前沒有待處理的回報。</p>
        ) : (
          <ul className="text-sm space-y-1">
            {pending.slice(0, 5).map((r) => (
              <li key={r.id}>
                <span className="badge badge-orange">{r.report_type}</span> {r.facility_id} — {r.message?.slice(0, 40) ?? "（無補充說明）"}
              </li>
            ))}
          </ul>
        )}
        <Link href="/admin/reports" className="text-brand text-sm font-semibold mt-2 inline-block">查看全部 →</Link>
      </div>

      <div className="card p-4 text-sm text-muted">
        <p className="mb-1">⚠️ Phase 1 限制：新增／編輯／刪除會寫入伺服器本機的 JSON 檔（data-store/），
        目前還沒有自動同步回公開網站的靜態頁面與種子資料。要讓修改出現在公開頁面，需要人工把
        data-store/ 的內容整併回 src/data/facilities/ 後重新建置，或是改接 Supabase（見 supabase/schema.sql）。</p>
      </div>
    </div>
  );
}
