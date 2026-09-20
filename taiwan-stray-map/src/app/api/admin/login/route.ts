import { NextRequest, NextResponse } from "next/server";
import { checkPassword, setAdminSession } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.password !== "string" || !checkPassword(body.password)) {
    return NextResponse.json({ error: "密碼錯誤" }, { status: 401 });
  }
  await setAdminSession();
  return NextResponse.json({ ok: true });
}
