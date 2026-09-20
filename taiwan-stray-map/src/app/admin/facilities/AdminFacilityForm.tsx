"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { COUNTIES } from "@/data/counties";
import {
  Facility,
  FacilityType,
  FACILITY_TYPE_LABELS,
  OrganizationNature,
  AnimalType,
  OperatingStatus,
  STATUS_LABELS,
  VerificationStatus,
  VERIFICATION_LABELS,
  TriState,
  TRISTATE_LABELS,
} from "@/types/facility";

const TRISTATE_KEYS: { key: keyof Facility; label: string }[] = [
  { key: "adoption_available", label: "認養" },
  { key: "volunteer_available", label: "志工" },
  { key: "donation_available", label: "捐款" },
  { key: "supplies_available", label: "物資" },
  { key: "visit_available", label: "參訪" },
  { key: "appointment_required", label: "需預約" },
  { key: "foster_help_available", label: "協助中途" },
];

type FormState = Partial<Facility> & { name: string; county: string };

export default function AdminFacilityForm({ initial, mode }: { initial?: Facility; mode: "new" | "edit" }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(
    initial ?? {
      name: "",
      county: COUNTIES[0].name,
      facility_type: "dog_shelter",
      organization_nature: "unknown",
      animal_type: "dog",
      status: "unknown",
      verification_status: "needs_verification",
      adoption_available: "unknown",
      volunteer_available: "unknown",
      donation_available: "unknown",
      supplies_available: "unknown",
      visit_available: "unknown",
      appointment_required: "unknown",
      foster_help_available: "unknown",
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = mode === "new" ? "/api/admin/facilities" : `/api/admin/facilities/${initial!.id}`;
      const method = mode === "new" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      router.push("/admin/facilities");
      router.refresh();
    } catch {
      setError("儲存失敗，請稍後再試一次。");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initial || !confirm(`確定要刪除「${initial.name}」嗎？`)) return;
    await fetch(`/api/admin/facilities/${initial.id}`, { method: "DELETE" });
    router.push("/admin/facilities");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="card p-4 grid sm:grid-cols-2 gap-3">
        <label className="text-sm">
          名稱 *
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full mt-1 rounded-lg border border-border px-3 py-2" />
        </label>
        <label className="text-sm">
          縣市 *
          <select value={form.county} onChange={(e) => set("county", e.target.value)} className="w-full mt-1 rounded-lg border border-border px-3 py-2">
            {COUNTIES.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
          </select>
        </label>
        <label className="text-sm">
          行政區
          <input value={form.district ?? ""} onChange={(e) => set("district", e.target.value)} className="w-full mt-1 rounded-lg border border-border px-3 py-2" />
        </label>
        <label className="text-sm">
          地址
          <input value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} className="w-full mt-1 rounded-lg border border-border px-3 py-2" />
        </label>
        <label className="text-sm">
          電話
          <input value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} className="w-full mt-1 rounded-lg border border-border px-3 py-2" />
        </label>
        <label className="text-sm">
          網站
          <input value={form.website ?? ""} onChange={(e) => set("website", e.target.value)} className="w-full mt-1 rounded-lg border border-border px-3 py-2" />
        </label>
        <label className="text-sm">
          Facebook
          <input value={form.facebook ?? ""} onChange={(e) => set("facebook", e.target.value)} className="w-full mt-1 rounded-lg border border-border px-3 py-2" />
        </label>
        <label className="text-sm">
          單位類型
          <select value={form.facility_type} onChange={(e) => set("facility_type", e.target.value as FacilityType)} className="w-full mt-1 rounded-lg border border-border px-3 py-2">
            {(Object.keys(FACILITY_TYPE_LABELS) as FacilityType[]).map((t) => <option key={t} value={t}>{FACILITY_TYPE_LABELS[t]}</option>)}
          </select>
        </label>
        <label className="text-sm">
          單位性質
          <select value={form.organization_nature} onChange={(e) => set("organization_nature", e.target.value as OrganizationNature)} className="w-full mt-1 rounded-lg border border-border px-3 py-2">
            <option value="government">政府</option>
            <option value="nonprofit">非營利</option>
            <option value="private">私人</option>
            <option value="unknown">尚未確認</option>
          </select>
        </label>
        <label className="text-sm">
          收容動物
          <select value={form.animal_type} onChange={(e) => set("animal_type", e.target.value as AnimalType)} className="w-full mt-1 rounded-lg border border-border px-3 py-2">
            <option value="dog">狗</option>
            <option value="cat">貓</option>
            <option value="dog_and_cat">狗＋貓</option>
            <option value="other">其他</option>
          </select>
        </label>
        <label className="text-sm">
          開放狀態
          <select value={form.status} onChange={(e) => set("status", e.target.value as OperatingStatus)} className="w-full mt-1 rounded-lg border border-border px-3 py-2">
            {(Object.keys(STATUS_LABELS) as OperatingStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </label>
        <label className="text-sm">
          資料可信度
          <select value={form.verification_status} onChange={(e) => set("verification_status", e.target.value as VerificationStatus)} className="w-full mt-1 rounded-lg border border-border px-3 py-2">
            {(Object.keys(VERIFICATION_LABELS) as VerificationStatus[]).map((s) => <option key={s} value={s}>{VERIFICATION_LABELS[s]}</option>)}
          </select>
        </label>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold text-coffee mb-2 text-sm">我可以怎麼幫忙</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {TRISTATE_KEYS.map(({ key, label }) => (
            <label key={key as string} className="text-sm">
              {label}
              <select
                value={(form[key] as TriState) ?? "unknown"}
                onChange={(e) => set(key, e.target.value as TriState)}
                className="w-full mt-1 rounded-lg border border-border px-3 py-2"
              >
                {(Object.keys(TRISTATE_LABELS) as TriState[]).map((v) => <option key={v} value={v}>{TRISTATE_LABELS[v]}</option>)}
              </select>
            </label>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="text-sm block">
          描述
          <textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={4} className="w-full mt-1 rounded-lg border border-border px-3 py-2" />
        </label>
      </div>

      {error && <p className="text-sm" style={{ color: "var(--status-red)" }}>{error}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="rounded-full bg-brand text-white font-bold px-6 py-2.5 disabled:opacity-60">
          {saving ? "儲存中…" : "儲存"}
        </button>
        {mode === "edit" && (
          <button type="button" onClick={handleDelete} className="rounded-full border border-border text-sm font-semibold px-4 py-2.5" style={{ color: "var(--status-red)" }}>
            刪除這筆資料
          </button>
        )}
      </div>
    </form>
  );
}
