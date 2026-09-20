import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { getMergedFacilityById, updateFacility, deleteFacility } from "@/lib/adminStore";

export async function GET(request: NextRequest, context: RouteContext<"/api/admin/facilities/[id]">) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "未登入" }, { status: 401 });
  const { id } = await context.params;
  const facility = await getMergedFacilityById(id);
  if (!facility) return NextResponse.json({ error: "找不到資料" }, { status: 404 });
  return NextResponse.json({ facility });
}

export async function PUT(request: NextRequest, context: RouteContext<"/api/admin/facilities/[id]">) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "未登入" }, { status: 401 });
  const { id } = await context.params;
  const patch = await request.json().catch(() => null);
  if (!patch) return NextResponse.json({ error: "格式錯誤" }, { status: 400 });
  delete patch.id;
  delete patch.slug;
  delete patch.created_at;
  await updateFacility(id, patch);
  const facility = await getMergedFacilityById(id);
  return NextResponse.json({ facility });
}

export async function DELETE(request: NextRequest, context: RouteContext<"/api/admin/facilities/[id]">) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "未登入" }, { status: 401 });
  const { id } = await context.params;
  await deleteFacility(id);
  return NextResponse.json({ ok: true });
}
