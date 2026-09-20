import { promises as fs } from "fs";
import path from "path";
import { Facility } from "@/types/facility";
import { ALL_FACILITIES } from "@/data/facilities";

// Phase 10 管理後台：Phase 1 沒有 Supabase 專案可寫入，因此新增／編輯／刪除
// 動作會寫入本機 JSON 檔（data-store/），並在讀取時與 TypeScript 種子資料
// （src/data/facilities）合併成「目前畫面看到的完整清單」。
//
// 重要限制：這個 overlay 只影響「管理後台」與呼叫 getMergedFacilities() 的
// API，還沒有自動同步回公開網站頁面（那些頁面目前直接讀取種子資料，
// 是建置時就固定好的靜態頁面）。正式上線建議改接 Supabase
// （schema 已備妥於 supabase/schema.sql），屆時管理後台的寫入會直接反映在
// 公開頁面，不需要這層 overlay。

interface AdminEdit {
  facility_id: string;
  patch: Partial<Facility>;
  updated_at: string;
}

const DIR = path.join(process.cwd(), "data-store");
const ADDED_PATH = path.join(DIR, "admin-added-facilities.json");
const EDITS_PATH = path.join(DIR, "admin-facility-edits.json");
const DELETED_PATH = path.join(DIR, "admin-deleted-facility-ids.json");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    await fs.mkdir(DIR, { recursive: true });
    await fs.writeFile(file, JSON.stringify(fallback, null, 2), "utf-8");
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T) {
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

export async function getAddedFacilities(): Promise<Facility[]> {
  return readJson<Facility[]>(ADDED_PATH, []);
}

export async function getEdits(): Promise<Record<string, AdminEdit>> {
  return readJson<Record<string, AdminEdit>>(EDITS_PATH, {});
}

export async function getDeletedIds(): Promise<string[]> {
  return readJson<string[]>(DELETED_PATH, []);
}

export async function getMergedFacilities(): Promise<Facility[]> {
  const [added, edits, deleted] = await Promise.all([getAddedFacilities(), getEdits(), getDeletedIds()]);
  const deletedSet = new Set(deleted);
  const base = [...ALL_FACILITIES, ...added]
    .filter((f) => !deletedSet.has(f.id))
    .map((f) => (edits[f.id] ? { ...f, ...edits[f.id].patch, updated_at: edits[f.id].updated_at } : f));
  return base;
}

export async function getMergedFacilityById(id: string): Promise<Facility | undefined> {
  const all = await getMergedFacilities();
  return all.find((f) => f.id === id || f.slug === id);
}

export async function createFacility(facility: Facility): Promise<void> {
  const added = await getAddedFacilities();
  added.push(facility);
  await writeJson(ADDED_PATH, added);
}

export async function updateFacility(id: string, patch: Partial<Facility>): Promise<void> {
  const edits = await getEdits();
  const existing = edits[id]?.patch ?? {};
  edits[id] = { facility_id: id, patch: { ...existing, ...patch }, updated_at: new Date().toISOString() };
  await writeJson(EDITS_PATH, edits);

  // 若是本來就在 admin-added-facilities.json 裡的資料，直接原地更新，避免疊加 patch。
  const added = await getAddedFacilities();
  const idx = added.findIndex((f) => f.id === id);
  if (idx >= 0) {
    added[idx] = { ...added[idx], ...patch, updated_at: new Date().toISOString() };
    await writeJson(ADDED_PATH, added);
  }
}

export async function deleteFacility(id: string): Promise<void> {
  const deleted = await getDeletedIds();
  if (!deleted.includes(id)) {
    deleted.push(id);
    await writeJson(DELETED_PATH, deleted);
  }
}
