import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import StatsGrid from "@/components/StatsGrid";
import CountyGrid from "@/components/CountyGrid";
import FacilityCard from "@/components/FacilityCard";
import FacilityMapLoader from "@/components/FacilityMapLoader";
import { getAllFacilities, getStats, getRecentUpdates, getActiveSupplyNeeds, filterFacilities } from "@/lib/facilities";
import { formatDate } from "@/lib/format";

export default function Home() {
  const facilities = getAllFacilities();
  const stats = getStats(facilities);
  const updates = getRecentUpdates(5);
  const supplyNeeds = getActiveSupplyNeeds().slice(0, 4);
  const adoptable = filterFacilities({ adoption: true }).slice(0, 3);
  const volunteerFriendly = filterFacilities({ volunteer: true }).slice(0, 3);
  const recentlyAdded = [...facilities].sort((a, b) => (a.created_at < b.created_at ? 1 : -1)).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-10">
      {/* Hero */}
      <section className="text-center pt-4 pb-2">
        <h1 className="text-3xl sm:text-4xl font-black text-coffee">🐶 全台浪浪救援地圖</h1>
        <p className="text-muted mt-2">找到離你最近的收容所、狗園與救援單位</p>
        <p className="text-sm text-accent mt-3 italic">每一個地址，背後都是一群正在等待被看見的生命。</p>
        <div className="mt-5 max-w-xl mx-auto">
          <SearchBar />
        </div>
        <div className="flex flex-wrap gap-3 justify-center mt-4">
          <Link href="/map" className="rounded-full bg-brand text-white px-5 py-2.5 text-sm font-bold">
            開始探索地圖
          </Link>
          <Link href="/adoption" className="rounded-full border border-brand text-brand px-5 py-2.5 text-sm font-bold">
            尋找可以認養的狗狗
          </Link>
        </div>
      </section>

      {/* Map preview */}
      <section>
        <h2 className="text-lg font-bold text-coffee mb-3">🗺 全台救援地圖</h2>
        <FacilityMapLoader facilities={facilities} />
        <p className="text-xs text-muted mt-2">
          🔵 公立收容所　🟠 民間狗園／私人救援　🟢 動物保護協會／教育園區　🟣 中途之家
        </p>
      </section>

      {/* Stats */}
      <section>
        <h2 className="text-lg font-bold text-coffee mb-3">全台救援地圖統計</h2>
        <StatsGrid stats={stats} />
      </section>

      {/* Quick links */}
      <section>
        <h2 className="text-lg font-bold text-coffee mb-3">快速搜尋</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/map" className="card p-4 text-center">
            <div className="text-2xl">📍</div>
            <div className="text-sm font-semibold text-coffee mt-1">找附近狗園</div>
          </Link>
          <Link href="/adoption" className="card p-4 text-center">
            <div className="text-2xl">🐕</div>
            <div className="text-sm font-semibold text-coffee mt-1">找可以領養的狗</div>
          </Link>
          <Link href="/volunteer" className="card p-4 text-center">
            <div className="text-2xl">🙋</div>
            <div className="text-sm font-semibold text-coffee mt-1">找志工機會</div>
          </Link>
          <Link href="/donation" className="card p-4 text-center">
            <div className="text-2xl">🥫</div>
            <div className="text-sm font-semibold text-coffee mt-1">找需要物資的地方</div>
          </Link>
        </div>
      </section>

      {/* Counties */}
      <section>
        <h2 className="text-lg font-bold text-coffee mb-3">各縣市</h2>
        <CountyGrid />
      </section>

      {/* Recent updates */}
      <section>
        <h2 className="text-lg font-bold text-coffee mb-3">📰 最新更新</h2>
        {updates.length === 0 ? (
          <p className="text-sm text-muted">目前尚無更新紀錄。</p>
        ) : (
          <div className="space-y-2">
            {updates.map((u) => (
              <Link key={u.id} href={`/facilities/${u.facilitySlug}`} className="card p-3 flex items-center gap-3 block">
                <span
                  className={`badge badge-${u.status_color}`}
                >
                  {u.status_color === "green" ? "🟢" : u.status_color === "yellow" ? "🟡" : u.status_color === "orange" ? "🟠" : "🔴"}
                </span>
                <div>
                  <div className="text-xs text-muted">{formatDate(u.date)}</div>
                  <div className="text-sm font-semibold text-coffee">{u.headline}</div>
                  <div className="text-xs text-muted">{u.facilityName}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recently added */}
      <section>
        <h2 className="text-lg font-bold text-coffee mb-3">🆕 最新加入資料庫</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {recentlyAdded.map((f) => (
            <FacilityCard key={f.id} facility={f} />
          ))}
        </div>
      </section>

      {/* Adoptable */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-coffee">🐕 認養中的狗狗</h2>
          <Link href="/adoption" className="text-sm text-brand font-semibold">查看全部 →</Link>
        </div>
        {adoptable.length === 0 ? (
          <p className="text-sm text-muted">目前尚無單位明確標示「可以認養」，多數資料仍待聯絡確認。</p>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {adoptable.map((f) => (
              <FacilityCard key={f.id} facility={f} />
            ))}
          </div>
        )}
      </section>

      {/* Volunteer */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-coffee">🙋 志工機會</h2>
          <Link href="/volunteer" className="text-sm text-brand font-semibold">查看全部 →</Link>
        </div>
        {volunteerFriendly.length === 0 ? (
          <p className="text-sm text-muted">目前尚無單位明確標示接受志工，多數資料仍待聯絡確認。</p>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {volunteerFriendly.map((f) => (
              <FacilityCard key={f.id} facility={f} />
            ))}
          </div>
        )}
      </section>

      {/* Supply needs */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-coffee">🥫 物資需求</h2>
          <Link href="/donation" className="text-sm text-brand font-semibold">查看全部 →</Link>
        </div>
        {supplyNeeds.length === 0 ? (
          <p className="text-sm text-muted">目前尚無單位回報明確的物資需求。</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {supplyNeeds.map((n, i) => (
              <div key={i} className="card p-3 text-sm">
                <div className="font-semibold text-coffee">{n.item} · {n.facilityName}</div>
                <div className="text-xs text-muted">
                  最後更新：{formatDate(n.updated_at)}
                  {n.isStale && <span style={{ color: "var(--status-orange)" }}> · ⚠️ 需求可能已過期，請聯絡單位確認</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About blurb */}
      <section className="card p-5 text-sm text-muted">
        本網站整理台灣公立動物收容所、民間狗園、動物保護協會與中途之家的資料，並清楚標示每筆資料的來源與最後確認日期。
        我們不做「最好的狗園」排名，只呈現資料、來源與更新時間，讓你自己判斷。
        <Link href="/about" className="text-brand font-semibold ml-1">了解更多 →</Link>
      </section>
    </div>
  );
}
