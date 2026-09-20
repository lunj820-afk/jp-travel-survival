import Link from "next/link";
import { listReports } from "@/lib/reportStore";

const TYPE_LABELS: Record<string, string> = {
  correct: "資料正確",
  wrong_address: "地址錯誤",
  closed: "已停止營運",
  wrong_phone: "電話錯誤",
  wrong_adoption_info: "認養資訊錯誤",
  other: "其他",
};

export default async function AdminReportsPage() {
  const reports = await listReports();

  return (
    <div className="space-y-3">
      <h2 className="font-bold text-coffee">使用者回報（共 {reports.length} 筆）</h2>
      {reports.length === 0 ? (
        <p className="text-sm text-muted">目前沒有回報紀錄。</p>
      ) : (
        <div className="card divide-y divide-border">
          {reports.map((r) => (
            <div key={r.id} className="p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="badge badge-orange">{TYPE_LABELS[r.report_type] ?? r.report_type}</span>
                <span className="text-xs text-muted">{new Date(r.created_at).toLocaleString("zh-TW")}</span>
              </div>
              <Link href={`/admin/facilities/${r.facility_id}`} className="font-semibold text-brand mt-1 inline-block">
                {r.facility_id}
              </Link>
              {r.message && <p className="text-coffee mt-1">{r.message}</p>}
              {r.contact_email && <p className="text-xs text-muted mt-1">聯絡信箱：{r.contact_email}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
