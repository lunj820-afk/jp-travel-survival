import { Metadata } from "next";
import { Suspense } from "react";
import { getAllFacilities } from "@/lib/facilities";
import ReportForm from "./ReportForm";

export const metadata: Metadata = {
  title: "資料回報",
  description: "回報收容所或狗園資料是否正確，協助我們維持資料的即時性。",
};

export default function ReportPage() {
  const facilities = getAllFacilities();

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-black text-coffee">🔄 資料回報</h1>
      <p className="text-sm text-muted">
        發現資料有誤、單位已搬遷或停止營運？請讓我們知道，這是讓資料庫保持正確最重要的方式。
      </p>
      <Suspense>
        <ReportForm facilities={facilities} />
      </Suspense>
    </div>
  );
}
