import Link from "next/link";
import { COUNTIES } from "@/data/counties";
import { getFacilitiesByCounty } from "@/lib/facilities";

export default function CountyGrid() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {COUNTIES.map((c) => {
        const count = getFacilitiesByCounty(c.name).length;
        return (
          <Link
            key={c.slug}
            href={`/county/${c.slug}`}
            className="card p-3 text-center hover:border-brand transition-colors"
          >
            <div className="font-semibold text-coffee text-sm">{c.name}</div>
            <div className="text-xs text-muted mt-0.5">{count} 個單位</div>
          </Link>
        );
      })}
    </div>
  );
}
