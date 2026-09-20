import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "twsm_admin";

// Phase 1 的管理後台採用單一密碼保護，方便先能實際維護資料。
// 正式上線務必改用 Supabase Auth（見 README），這裡的密碼保護只適合內部/開發階段使用。
function getPassword(): string {
  return process.env.ADMIN_PASSWORD || "strayrescue2026";
}

function sessionToken(): string {
  return crypto.createHash("sha256").update(getPassword()).digest("hex");
}

export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === sessionToken();
}

export function checkPassword(password: string): boolean {
  return password === getPassword();
}

export async function setAdminSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
