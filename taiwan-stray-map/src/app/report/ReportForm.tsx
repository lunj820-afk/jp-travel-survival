"use client";

import { useState } from "react";
import { Facility } from "@/types/facility";

const REPORT_TYPES: { value: string; label: string }[] = [
  { value: "correct", label: "資料正確" },
  { value: "wrong_address", label: "地址錯誤" },
  { value: "closed", label: "已停止營運" },
  { value: "wrong_phone", label: "電話錯誤" },
  { value: "wrong_adoption_info", label: "認養資訊錯誤" },
  { value: "other", label: "其他" },
];

export default function ReportForm({ facilities, defaultSlug }: { facilities: Facility[]; defaultSlug?: string }) {
  const [facilitySlug, setFacilitySlug] = useState(defaultSlug ?? facilities[0]?.slug ?? "");
  const [reportType, setReportType] = useState("correct");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("submitting");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facility_id: facilitySlug,
          report_type: reportType,
          message: message || undefined,
          contact_email: email || undefined,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setState("done");
      setMessage("");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="card p-5 text-center">
        <div className="text-3xl mb-2">✅</div>
        <p className="font-semibold text-coffee">感謝你的回報！</p>
        <p className="text-sm text-muted mt-1">我們會盡快核對這筆資料。</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-4">
      <div>
        <label className="block text-sm font-semibold text-coffee mb-1">要回報哪個單位？</label>
        <select
          value={facilitySlug}
          onChange={(e) => setFacilitySlug(e.target.value)}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        >
          {facilities.map((f) => (
            <option key={f.slug} value={f.slug}>{f.name}（{f.county}{f.district ?? ""}）</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-coffee mb-1">回報類型</label>
        <div className="flex flex-wrap gap-2">
          {REPORT_TYPES.map((t) => (
            <label
              key={t.value}
              className={`badge cursor-pointer ${reportType === t.value ? "badge-green" : "badge-gray"}`}
            >
              <input
                type="radio"
                name="reportType"
                value={t.value}
                className="hidden"
                checked={reportType === t.value}
                onChange={() => setReportType(t.value)}
              />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-coffee mb-1">補充說明（選填）</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          placeholder="例如：正確地址、目前的電話、營運狀態等"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-coffee mb-1">聯絡 Email（選填，方便我們追問細節）</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full rounded-full bg-brand text-white font-bold py-3 disabled:opacity-60"
      >
        {state === "submitting" ? "送出中…" : "送出回報"}
      </button>
      {state === "error" && <p className="text-sm text-center" style={{ color: "var(--status-red)" }}>送出失敗，請稍後再試一次。</p>}
    </form>
  );
}
