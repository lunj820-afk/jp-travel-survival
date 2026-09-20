import { NextRequest, NextResponse } from "next/server";
import { addReport, listReports } from "@/lib/reportStore";
import { getFacilityBySlug } from "@/lib/facilities";
import { isAdminAuthed } from "@/lib/adminAuth";
import { UserReport } from "@/types/facility";

const VALID_TYPES: UserReport["report_type"][] = [
  "correct",
  "wrong_address",
  "closed",
  "wrong_phone",
  "wrong_adoption_info",
  "other",
];

export async function GET() {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "未登入" }, { status: 401 });
  const reports = await listReports();
  return NextResponse.json({ reports });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.facility_id !== "string" || !VALID_TYPES.includes(body.report_type)) {
    return NextResponse.json({ error: "缺少必要欄位" }, { status: 400 });
  }
  const facility = getFacilityBySlug(body.facility_id);
  if (!facility) {
    return NextResponse.json({ error: "找不到這個單位" }, { status: 404 });
  }
  const report = await addReport({
    facility_id: facility.slug,
    report_type: body.report_type,
    message: typeof body.message === "string" ? body.message.slice(0, 2000) : undefined,
    contact_email: typeof body.contact_email === "string" ? body.contact_email.slice(0, 200) : undefined,
  });
  return NextResponse.json({ report }, { status: 201 });
}
