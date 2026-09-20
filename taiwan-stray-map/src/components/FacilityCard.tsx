import Link from "next/link";
import { Facility, FACILITY_TYPE_ICON, FACILITY_TYPE_LABELS } from "@/types/facility";
import { VerificationBadge } from "./Badges";

function tristateIcon(v: Facility["adoption_available"]) {
  if (v === "yes") return "💚";
  if (v === "conditional") return "💛";
  if (v === "no") return "⚪";
  return "❔";
}

export default function FacilityCard({ facility }: { facility: Facility }) {
  const f = facility;
  const locationLabel = [f.county, f.district].filter(Boolean).join("");
  const mapQuery = encodeURIComponent(f.address ?? `${locationLabel} ${f.name}`);

  return (
    <div className="card p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-bold text-coffee flex items-center gap-1.5">
            <span>{FACILITY_TYPE_ICON[f.facility_type]}</span>
            <Link href={`/facilities/${f.slug}`} className="hover:underline">
              {f.name}
            </Link>
          </div>
          <div className="text-xs text-muted mt-0.5">📍 {locationLabel || "縣市待確認"}</div>
        </div>
        <VerificationBadge status={f.verification_status} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="badge badge-gray">{FACILITY_TYPE_LABELS[f.facility_type]}</span>
        {(f.features ?? []).slice(0, 2).map((feat) => (
          <span key={feat} className="badge" style={{ background: "var(--accent-soft)", color: "var(--coffee)" }}>
            ❤️ {feat}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1 text-xs text-coffee border-t border-border pt-2 mt-1">
        <div>{tristateIcon(f.adoption_available)} 認養</div>
        <div>{tristateIcon(f.volunteer_available)} 志工</div>
        <div>{tristateIcon(f.donation_available)} 捐款</div>
      </div>

      <div className="flex gap-2 mt-1">
        <Link
          href={`/facilities/${f.slug}`}
          className="flex-1 text-center text-sm font-semibold rounded-lg py-2 bg-brand text-white"
        >
          查看詳細資料
        </Link>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-sm font-semibold rounded-lg py-2 border border-border text-coffee"
        >
          地圖導航
        </a>
      </div>
    </div>
  );
}
