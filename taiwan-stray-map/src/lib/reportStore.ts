import { promises as fs } from "fs";
import path from "path";
import { UserReport } from "@/types/facility";

// Phase 1 先以本機 JSON 檔模擬資料庫寫入，方便在沒有 Supabase 專案的情況下
// 展示完整的回報流程。正式上線建議改為 supabase/schema.sql 的 user_reports 表
// （src/lib/reportStore.ts 是唯一需要替換的檔案，其餘程式碼不受影響）。
const STORE_PATH = path.join(process.cwd(), "data-store", "user-reports.json");

async function ensureStore(): Promise<UserReport[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as UserReport[];
  } catch {
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.writeFile(STORE_PATH, "[]", "utf-8");
    return [];
  }
}

export async function listReports(): Promise<UserReport[]> {
  return ensureStore();
}

export async function addReport(input: Omit<UserReport, "id" | "created_at" | "status">): Promise<UserReport> {
  const reports = await ensureStore();
  const report: UserReport = {
    ...input,
    id: `report-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    created_at: new Date().toISOString(),
    status: "pending",
  };
  reports.unshift(report);
  await fs.writeFile(STORE_PATH, JSON.stringify(reports, null, 2), "utf-8");
  return report;
}
