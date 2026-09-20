// 全台浪浪救援地圖 — 核心資料型別
// 對應 Supabase schema，詳見 supabase/schema.sql

export type FacilityType =
  | "public_shelter" // 公立動物收容所
  | "private_rescue" // 私人救援
  | "dog_shelter" // 民間狗園
  | "animal_rescue" // 犬貓救援
  | "animal_protection_association" // 動物保護協會
  | "foster_home" // 中途之家
  | "foster_network" // 中途家庭網絡
  | "dog_cat_rescue" // 犬貓救援單位
  | "animal_welfare_organization" // 動物保護教育園區/福利組織
  | "other";

export type OrganizationNature = "government" | "nonprofit" | "private" | "unknown";

export type AnimalType = "dog" | "cat" | "dog_and_cat" | "other";

/** 三態旗標：是/需確認/否（不確定時一律用 unknown，不可自行推測為 yes） */
export type TriState = "yes" | "conditional" | "unknown" | "no";

export type OperatingStatus =
  | "normal" // 正常營運
  | "appointment_only" // 預約制
  | "suspended" // 暫停收容
  | "closed" // 已停止
  | "unknown"; // 待確認

export type VerificationStatus =
  | "verified" // 已驗證
  | "partial_verified" // 部分驗證
  | "needs_verification" // 待確認
  | "closed" // 已確認停止營運
  | "unknown"; // 狀態不明

export type SourceType =
  | "government" // 政府官方網站
  | "official_website" // 單位官方網站
  | "official_facebook" // 官方 Facebook
  | "official_instagram"
  | "google_maps"
  | "news" // 新聞報導
  | "animal_welfare_group" // 動物保護團體
  | "direct_contact" // 實際聯絡確認
  | "volunteer_provided" // 志工提供
  | "other";

export interface FacilitySource {
  id: string;
  facility_id: string;
  source_name: string;
  source_url?: string;
  source_type: SourceType;
  verified_date: string; // ISO date
  verified_by?: string;
  verification_status: VerificationStatus;
  note?: string;
}

export interface FacilityUpdate {
  id: string;
  facility_id: string;
  date: string; // ISO date
  category: "address" | "status" | "adoption" | "volunteer" | "donation" | "supplies" | "general";
  headline: string;
  detail?: string;
  status_color: "green" | "yellow" | "orange" | "red";
}

export interface SupplyNeed {
  item: string;
  updated_at: string; // ISO date
  source?: string;
}

export interface UserReport {
  id: string;
  facility_id: string;
  report_type:
    | "correct" // 資料正確
    | "wrong_address"
    | "closed"
    | "wrong_phone"
    | "wrong_adoption_info"
    | "other";
  message?: string;
  contact_email?: string;
  created_at: string;
  status: "pending" | "reviewed" | "resolved";
}

export interface Facility {
  id: string;
  slug: string;
  name: string;
  alias?: string[];

  county: string; // 縣市（對應 counties.ts 的 name）
  district?: string; // 行政區
  /** 完整地址；若涉及私人住宅且未經單位同意公開，則為 undefined，改用 address_public_note */
  address?: string;
  /** 當地址不便公開時，顯示的替代說明，例如「台南市○○區（需聯絡單位確認實際地址）」 */
  address_public_note?: string;
  latitude?: number;
  longitude?: number;

  facility_type: FacilityType;
  organization_nature: OrganizationNature;
  animal_type: AnimalType;

  dog_count?: number;
  cat_count?: number;
  total_animal_count?: number;
  /** 上述數量資料的採集日期，避免被誤認為即時數字 */
  animal_count_as_of?: string;

  adoption_available: TriState;
  volunteer_available: TriState;
  donation_available: TriState;
  supplies_available: TriState;
  visit_available: TriState;
  appointment_required: TriState;
  foster_help_available: TriState;

  phone?: string;
  email?: string;
  website?: string;
  facebook?: string;
  instagram?: string;

  description?: string;
  features?: string[];
  opening_hours?: string;

  status: OperatingStatus;
  verification_status: VerificationStatus;
  last_verified_at?: string; // ISO date

  supply_needs?: SupplyNeed[];
  sources: FacilitySource[];
  updates?: FacilityUpdate[];

  created_at: string;
  updated_at: string;
}

export interface District {
  county: string;
  name: string;
}

export interface CountyInfo {
  slug: string;
  name: string;
  region: "north" | "central" | "south" | "east" | "islands";
  districts: string[];
}

export const FACILITY_TYPE_LABELS: Record<FacilityType, string> = {
  public_shelter: "公立動物收容所",
  private_rescue: "私人救援",
  dog_shelter: "民間狗園",
  animal_rescue: "犬貓救援",
  animal_protection_association: "動物保護協會",
  foster_home: "中途之家",
  foster_network: "中途家庭",
  dog_cat_rescue: "犬貓救援單位",
  animal_welfare_organization: "動物保護教育園區",
  other: "其他",
};

export const FACILITY_TYPE_ICON: Record<FacilityType, string> = {
  public_shelter: "🏛",
  private_rescue: "🐾",
  dog_shelter: "🐕",
  animal_rescue: "🐶",
  animal_protection_association: "❤️",
  foster_home: "🏠",
  foster_network: "🏡",
  dog_cat_rescue: "🐶",
  animal_welfare_organization: "🏛",
  other: "❓",
};

export const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  verified: "已驗證",
  partial_verified: "部分驗證",
  needs_verification: "待確認",
  closed: "已確認停止營運",
  unknown: "狀態不明",
};

export const VERIFICATION_COLOR: Record<VerificationStatus, string> = {
  verified: "green",
  partial_verified: "yellow",
  needs_verification: "orange",
  closed: "red",
  unknown: "gray",
};

export const STATUS_LABELS: Record<OperatingStatus, string> = {
  normal: "正常營運",
  appointment_only: "預約制",
  suspended: "暫停收容",
  closed: "已停止",
  unknown: "待確認",
};

export const STATUS_COLOR: Record<OperatingStatus, string> = {
  normal: "green",
  appointment_only: "yellow",
  suspended: "orange",
  closed: "red",
  unknown: "gray",
};

export const TRISTATE_LABELS: Record<TriState, string> = {
  yes: "是",
  conditional: "需事先聯絡／視情況",
  unknown: "尚未確認",
  no: "否",
};
