"use client";

import { useMemo, useState } from "react";
import { COUNTIES } from "@/data/counties";
import { filterFacilities, FacilityFilters } from "@/lib/facilities";
import { Facility, FACILITY_TYPE_LABELS, FacilityType, AnimalType, OperatingStatus, STATUS_LABELS } from "@/types/facility";
import FacilityCard from "./FacilityCard";
import FacilityMapLoader from "./FacilityMapLoader";

const FACILITY_TYPE_OPTIONS: FacilityType[] = [
  "public_shelter",
  "dog_shelter",
  "private_rescue",
  "animal_protection_association",
  "foster_home",
  "foster_network",
  "dog_cat_rescue",
  "animal_welfare_organization",
  "other",
];

const ANIMAL_TYPE_LABELS: Record<AnimalType, string> = {
  dog: "狗",
  cat: "貓",
  dog_and_cat: "狗＋貓",
  other: "其他動物",
};

const STATUS_OPTIONS: OperatingStatus[] = ["normal", "appointment_only", "suspended", "closed", "unknown"];

const CAN_HELP_OPTIONS: { key: keyof FacilityFilters; label: string }[] = [
  { key: "adoption", label: "可以認養" },
  { key: "volunteer", label: "可以當志工" },
  { key: "donation", label: "可以捐款" },
  { key: "supplies", label: "可以捐物資" },
  { key: "visit", label: "可以參訪" },
  { key: "foster", label: "可以協助中途" },
];

function toggle<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function FacilityExplorer({
  facilities,
  showMap = false,
  initialQuery = "",
  lockedCounty,
}: {
  facilities: Facility[];
  showMap?: boolean;
  initialQuery?: string;
  lockedCounty?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [county, setCounty] = useState<string>(lockedCounty ?? "");
  const [types, setTypes] = useState<FacilityType[]>([]);
  const [animals, setAnimals] = useState<AnimalType[]>([]);
  const [statuses, setStatuses] = useState<OperatingStatus[]>([]);
  const [canHelp, setCanHelp] = useState<Record<string, boolean>>({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const filters: FacilityFilters = {
      query,
      county: county || undefined,
      facilityTypes: types.length ? types : undefined,
      animalTypes: animals.length ? animals : undefined,
      status: statuses.length ? statuses : undefined,
    };
    for (const opt of CAN_HELP_OPTIONS) {
      if (canHelp[opt.key as string]) {
        (filters as Record<string, unknown>)[opt.key as string] = true;
      }
    }
    return filterFacilities(filters, facilities);
  }, [query, county, types, animals, statuses, canHelp, facilities]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜尋名稱、地址、行政區…"
          className="flex-1 rounded-full border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand"
        />
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-coffee"
        >
          篩選 {filtersOpen ? "▲" : "▼"}
        </button>
      </div>

      {filtersOpen && (
        <div className="card p-4 space-y-4 text-sm">
          {!lockedCounty && (
            <div>
              <div className="font-semibold text-coffee mb-1.5">縣市</div>
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="rounded-lg border border-border px-3 py-2 text-sm w-full sm:w-auto"
              >
                <option value="">全部</option>
                {COUNTIES.map((c) => (
                  <option key={c.slug} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <div className="font-semibold text-coffee mb-1.5">單位類型</div>
            <div className="flex flex-wrap gap-2">
              {FACILITY_TYPE_OPTIONS.map((t) => (
                <label key={t} className={`badge cursor-pointer ${types.includes(t) ? "badge-green" : "badge-gray"}`}>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={types.includes(t)}
                    onChange={() => setTypes((prev) => toggle(prev, t))}
                  />
                  {FACILITY_TYPE_LABELS[t]}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="font-semibold text-coffee mb-1.5">收容動物</div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(ANIMAL_TYPE_LABELS) as AnimalType[]).map((a) => (
                <label key={a} className={`badge cursor-pointer ${animals.includes(a) ? "badge-green" : "badge-gray"}`}>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={animals.includes(a)}
                    onChange={() => setAnimals((prev) => toggle(prev, a))}
                  />
                  {ANIMAL_TYPE_LABELS[a]}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="font-semibold text-coffee mb-1.5">可以做什麼</div>
            <div className="flex flex-wrap gap-2">
              {CAN_HELP_OPTIONS.map((opt) => (
                <label key={opt.key as string} className={`badge cursor-pointer ${canHelp[opt.key as string] ? "badge-green" : "badge-gray"}`}>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={!!canHelp[opt.key as string]}
                    onChange={() => setCanHelp((prev) => ({ ...prev, [opt.key as string]: !prev[opt.key as string] }))}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="font-semibold text-coffee mb-1.5">開放狀態</div>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <label key={s} className={`badge cursor-pointer ${statuses.includes(s) ? "badge-green" : "badge-gray"}`}>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={statuses.includes(s)}
                    onChange={() => setStatuses((prev) => toggle(prev, s))}
                  />
                  {STATUS_LABELS[s]}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="text-sm text-muted">共 {filtered.length} 個單位符合條件</p>

      {showMap && <FacilityMapLoader facilities={filtered} />}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((f) => (
          <FacilityCard key={f.id} facility={f} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted col-span-full text-center py-8">找不到符合條件的單位，試試調整篩選條件。</p>
        )}
      </div>
    </div>
  );
}
