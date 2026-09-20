import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { getMergedFacilities, createFacility } from "@/lib/adminStore";
import { Facility } from "@/types/facility";

export async function GET() {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "未登入" }, { status: 401 });
  const facilities = await getMergedFacilities();
  return NextResponse.json({ facilities });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "未登入" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.name !== "string" || typeof body.county !== "string") {
    return NextResponse.json({ error: "缺少必要欄位（名稱、縣市）" }, { status: 400 });
  }
  const now = new Date().toISOString();
  const id = `admin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const facility: Facility = {
    id,
    slug: id,
    name: body.name,
    county: body.county,
    district: body.district || undefined,
    address: body.address || undefined,
    phone: body.phone || undefined,
    website: body.website || undefined,
    facebook: body.facebook || undefined,
    description: body.description || undefined,
    facility_type: body.facility_type || "other",
    organization_nature: body.organization_nature || "unknown",
    animal_type: body.animal_type || "dog",
    adoption_available: body.adoption_available || "unknown",
    volunteer_available: body.volunteer_available || "unknown",
    donation_available: body.donation_available || "unknown",
    supplies_available: body.supplies_available || "unknown",
    visit_available: body.visit_available || "unknown",
    appointment_required: body.appointment_required || "unknown",
    foster_help_available: body.foster_help_available || "unknown",
    status: body.status || "unknown",
    verification_status: body.verification_status || "needs_verification",
    sources: [],
    created_at: now,
    updated_at: now,
  };
  await createFacility(facility);
  return NextResponse.json({ facility }, { status: 201 });
}
