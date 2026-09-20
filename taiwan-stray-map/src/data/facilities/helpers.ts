import { Facility, FacilitySource, TriState } from "@/types/facility";

const TODAY = "2026-09-20";

let seq = 0;
/** 產生穩定、網址安全的 slug（中文單位名稱多、缺乏公開英文名，先以序號＋縣市代碼命名，
 * 待資料正式驗證後可由後台改成有意義的英文 slug）。 */
export function nextSlug(prefix: string): string {
  seq += 1;
  return `${prefix}-${String(seq).padStart(3, "0")}`;
}

export function source(partial: Partial<FacilitySource> & { source_name: string; source_type: FacilitySource["source_type"]; verification_status: FacilitySource["verification_status"] }): FacilitySource {
  return {
    id: `src-${Math.random().toString(36).slice(2, 9)}`,
    facility_id: "",
    verified_date: TODAY,
    ...partial,
  };
}

type FacilityInput = Partial<Facility> & {
  id: string;
  name: string;
  county: string;
  facility_type: Facility["facility_type"];
};

const UNKNOWN: TriState = "unknown";

/** 建立一筆單位資料，並補上所有欄位的預設值（一律以「尚未確認」為起點，避免臆測）。 */
export function createFacility(input: FacilityInput): Facility {
  const now = TODAY;
  return {
    slug: input.id,
    alias: [],
    organization_nature: "unknown",
    animal_type: "dog",
    adoption_available: UNKNOWN,
    volunteer_available: UNKNOWN,
    donation_available: UNKNOWN,
    supplies_available: UNKNOWN,
    visit_available: UNKNOWN,
    appointment_required: UNKNOWN,
    foster_help_available: UNKNOWN,
    status: "unknown",
    verification_status: "needs_verification",
    sources: [],
    created_at: now,
    updated_at: now,
    ...input,
  };
}
