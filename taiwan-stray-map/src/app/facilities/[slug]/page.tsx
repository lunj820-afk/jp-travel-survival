import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getAllFacilities, getFacilityBySlug } from "@/lib/facilities";
import { VerificationBadge, StatusBadge, FacilityTypeBadge, TriStateLine } from "@/components/Badges";
import { dataQuality, formatDate, latestVerifiedDate, daysSince } from "@/lib/format";
import FacilityMapLoader from "@/components/FacilityMapLoader";

export function generateStaticParams() {
  return getAllFacilities().map((f) => ({ slug: f.slug }));
}

export async function generateMetadata(props: PageProps<"/facilities/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const f = getFacilityBySlug(slug);
  if (!f) return {};
  const location = [f.county, f.district].filter(Boolean).join("");
  return {
    title: `${f.name}｜地址、認養、志工、捐款資訊`,
    description: `整理${location}${f.name}的所在地區、救援特色、認養、志工與物資資訊，資料來源與最後確認日期清楚標示。`,
  };
}

export default async function FacilityDetailPage(props: PageProps<"/facilities/[slug]">) {
  const { slug } = await props.params;
  const f = getFacilityBySlug(slug);
  if (!f) notFound();

  const location = [f.county, f.district].filter(Boolean).join("");
  const quality = dataQuality(f);
  const verifiedDate = latestVerifiedDate(f);
  const mapQuery = encodeURIComponent(f.address ?? `${location} ${f.name}`);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          <FacilityTypeBadge type={f.facility_type} />
          {(f.features ?? []).map((feat) => (
            <span key={feat} className="badge" style={{ background: "var(--accent-soft)", color: "var(--coffee)" }}>
              {feat}
            </span>
          ))}
        </div>
        <h1 className="text-2xl font-black text-coffee">{f.name}</h1>
        <p className="text-muted text-sm mt-1">📍 {location || "地區待確認"}</p>
        <div className="flex gap-2 mt-2 flex-wrap">
          <VerificationBadge status={f.verification_status} />
          <StatusBadge status={f.status} />
        </div>
      </div>

      {f.description && <p className="text-sm text-coffee leading-relaxed">{f.description}</p>}

      {f.total_animal_count != null && (
        <div className="card p-3 text-sm">
          資料來源顯示曾照護約 <b>{f.total_animal_count}</b> 隻毛孩
          {f.animal_count_as_of && <>（資料日期：{formatDate(f.animal_count_as_of)}）</>}。
          此為歷史紀錄，<b>非即時數字</b>，請以下方「資料最後確認日期」為準。
        </div>
      )}

      {/* 基本資料 */}
      <section className="card p-4">
        <h2 className="font-bold text-coffee mb-3">📍 基本資料</h2>
        <dl className="text-sm grid grid-cols-[5rem_1fr] gap-y-2">
          <dt className="text-muted">名稱</dt><dd>{f.name}</dd>
          <dt className="text-muted">縣市</dt><dd>{f.county}</dd>
          <dt className="text-muted">行政區</dt><dd>{f.district ?? "尚未確認"}</dd>
          <dt className="text-muted">地址</dt>
          <dd>{f.address ?? f.address_public_note ?? "需聯絡單位確認"}</dd>
          <dt className="text-muted">電話</dt><dd>{f.phone ?? "尚未確認"}</dd>
          <dt className="text-muted">類型</dt><dd>{f.facility_type && <FacilityTypeBadge type={f.facility_type} />}</dd>
        </dl>
        {f.address && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 rounded-lg bg-brand text-white text-sm font-semibold px-4 py-2"
          >
            🗺 地圖導航
          </a>
        )}
      </section>

      {f.address && f.latitude && f.longitude && (
        <FacilityMapLoader facilities={[f]} center={[f.latitude, f.longitude]} zoom={14} height="260px" />
      )}

      {/* 我可以怎麼幫忙 */}
      <section className="card p-4">
        <h2 className="font-bold text-coffee mb-2">❤️ 我可以怎麼幫忙？</h2>
        <TriStateLine label="認養" icon="🏠" value={f.adoption_available} />
        <TriStateLine label="志工" icon="🙋" value={f.volunteer_available} />
        <TriStateLine label="捐款" icon="💰" value={f.donation_available} />
        <TriStateLine label="捐物資" icon="🥫" value={f.supplies_available} />
        <TriStateLine label="參訪" icon="🚶" value={f.visit_available} />
        <TriStateLine label="協助中途" icon="🐕" value={f.foster_help_available} />
        {f.donation_available === "yes" && f.website && (
          <a href={f.website} target="_blank" rel="noopener noreferrer" className="text-brand text-sm font-semibold underline">
            前往官方捐款方式 →
          </a>
        )}
      </section>

      {/* 物資需求 */}
      {f.supply_needs && f.supply_needs.length > 0 && (
        <section className="card p-4">
          <h2 className="font-bold text-coffee mb-2">🥫 最近需要什麼？</h2>
          <ul className="text-sm space-y-1">
            {f.supply_needs.map((n) => {
              const age = daysSince(n.updated_at);
              return (
                <li key={n.item}>
                  {n.item} — 最後更新：{formatDate(n.updated_at)}
                  {age > 30 && <span className="text-xs" style={{ color: "var(--status-orange)" }}> ⚠️ 需求可能已過期，請聯絡單位確認</span>}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* 聯絡方式 */}
      <section className="card p-4">
        <h2 className="font-bold text-coffee mb-2">📞 聯絡方式</h2>
        <dl className="text-sm grid grid-cols-[5rem_1fr] gap-y-2">
          <dt className="text-muted">電話</dt><dd>{f.phone ?? "尚未確認"}</dd>
          <dt className="text-muted">Email</dt><dd>{f.email ?? "尚未確認"}</dd>
          <dt className="text-muted">網站</dt><dd>{f.website ? <a className="text-brand underline" href={f.website} target="_blank" rel="noopener noreferrer">{f.website}</a> : "尚未確認"}</dd>
          <dt className="text-muted">Facebook</dt><dd>{f.facebook ? <a className="text-brand underline" href={f.facebook} target="_blank" rel="noopener noreferrer">前往 Facebook</a> : "尚未確認"}</dd>
        </dl>
      </section>

      {/* 資料可信度 */}
      <section className="card p-4">
        <h2 className="font-bold text-coffee mb-2">資料可信度</h2>
        <VerificationBadge status={f.verification_status} />
        <div className="text-sm text-muted mt-2">資料最後確認日期：{formatDate(verifiedDate)}</div>
        <h3 className="font-semibold text-coffee text-sm mt-3 mb-1">驗證來源</h3>
        <ul className="text-sm space-y-1">
          {f.sources.map((s) => (
            <li key={s.id}>
              ✓ {s.source_url ? (
                <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="text-brand underline">{s.source_name}</a>
              ) : s.source_name}
              <span className="text-muted"> · {formatDate(s.verified_date)}</span>
              {s.note && <div className="text-xs text-muted pl-4">{s.note}</div>}
            </li>
          ))}
        </ul>
      </section>

      {/* 資料完整度 */}
      <section className="card p-4">
        <h2 className="font-bold text-coffee mb-2">資料完整度 {quality.percent}%</h2>
        <p className="text-xs text-muted mb-2">此為資料填寫完整度統計，不是對單位的評分。</p>
        <ul className="text-sm grid grid-cols-2 gap-1">
          {quality.fields.map((field) => (
            <li key={field.label}>{field.ok ? "✓" : "—"} {field.label}</li>
          ))}
        </ul>
      </section>

      {/* 資料更新 */}
      {f.updates && f.updates.length > 0 && (
        <section className="card p-4">
          <h2 className="font-bold text-coffee mb-2">最近更新紀錄</h2>
          <ul className="text-sm space-y-2">
            {f.updates.map((u) => (
              <li key={u.id}>
                <span className={`badge badge-${u.status_color}`}>{formatDate(u.date)}</span>{" "}
                <b>{u.headline}</b>
                {u.detail && <div className="text-xs text-muted">{u.detail}</div>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 回報 */}
      <section className="card p-4 text-center">
        <h2 className="font-bold text-coffee mb-2">🔄 這筆資料正確嗎？</h2>
        <Link
          href={`/report?facility=${f.slug}`}
          className="inline-block rounded-full bg-accent text-white text-sm font-bold px-5 py-2.5"
        >
          回報這筆資料
        </Link>
      </section>
    </div>
  );
}
