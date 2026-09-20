import Link from "next/link";
import { getMergedFacilities } from "@/lib/adminStore";
import { VerificationBadge } from "@/components/Badges";

export default async function AdminFacilitiesPage() {
  const facilities = await getMergedFacilities();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-coffee">單位管理（共 {facilities.length} 筆）</h2>
        <Link href="/admin/facilities/new" className="rounded-full bg-brand text-white text-sm font-bold px-4 py-2">
          ＋ 新增單位
        </Link>
      </div>
      <div className="card divide-y divide-border">
        {facilities.map((f) => (
          <div key={f.id} className="p-3 flex items-center justify-between gap-2 text-sm">
            <div>
              <div className="font-semibold text-coffee">{f.name}</div>
              <div className="text-xs text-muted">{f.county}{f.district ?? ""}</div>
            </div>
            <div className="flex items-center gap-2">
              <VerificationBadge status={f.verification_status} />
              <Link href={`/admin/facilities/${f.id}`} className="text-brand font-semibold">編輯</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
