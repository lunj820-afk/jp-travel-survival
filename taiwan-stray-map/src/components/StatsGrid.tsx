import { FacilityStats } from "@/lib/facilities";

export default function StatsGrid({ stats }: { stats: FacilityStats }) {
  const items = [
    { icon: "🏠", label: "公立收容所", value: stats.publicShelters },
    { icon: "🐶", label: "民間狗園／私人救援", value: stats.privateShelters },
    { icon: "❤️", label: "動物保護組織", value: stats.associations },
    { icon: "🏡", label: "中途之家／中途組織", value: stats.fosterHomes },
    { icon: "📍", label: "已確認地址", value: stats.addressConfirmed },
    { icon: "❓", label: "待確認資料", value: stats.needsVerification },
    { icon: "⚠️", label: "暫停收容／狀態不明", value: stats.suspendedOrUnclear },
  ];
  return (
    <div>
      <p className="text-sm text-muted mb-3">
        目前資料庫收錄 <b className="text-coffee">{stats.total}</b> 個救援／收容單位，其中{" "}
        <b className="text-coffee">{stats.verified}</b> 筆已完成官方來源驗證，
        <b className="text-coffee">{stats.needsVerification}</b> 筆仍待確認。這些數字皆為即時計算，不是預先寫死的估計值。
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((it) => (
          <div key={it.label} className="card p-3 text-center">
            <div className="text-2xl">{it.icon}</div>
            <div className="text-xl font-bold text-coffee">{it.value}</div>
            <div className="text-xs text-muted">{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
