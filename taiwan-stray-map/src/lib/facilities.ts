import { ALL_FACILITIES } from "@/data/facilities";
import {
  Facility,
  FacilityType,
  AnimalType,
  VerificationStatus,
  OperatingStatus,
} from "@/types/facility";

export interface FacilityFilters {
  county?: string;
  district?: string;
  facilityTypes?: FacilityType[];
  animalTypes?: AnimalType[];
  status?: OperatingStatus[];
  adoption?: boolean;
  volunteer?: boolean;
  donation?: boolean;
  supplies?: boolean;
  visit?: boolean;
  foster?: boolean;
  query?: string;
}

export function getAllFacilities(): Facility[] {
  return ALL_FACILITIES;
}

export function getFacilityBySlug(slug: string): Facility | undefined {
  return ALL_FACILITIES.find((f) => f.slug === slug || f.id === slug);
}

export function getFacilitiesByCounty(county: string): Facility[] {
  return ALL_FACILITIES.filter((f) => f.county === county);
}

function matchesTristate(value: Facility[keyof Facility]) {
  return value === "yes" || value === "conditional";
}

export function filterFacilities(filters: FacilityFilters, baseFacilities: Facility[] = ALL_FACILITIES): Facility[] {
  let results = baseFacilities;

  if (filters.county) {
    results = results.filter((f) => f.county === filters.county);
  }
  if (filters.district) {
    results = results.filter((f) => f.district === filters.district);
  }
  if (filters.facilityTypes?.length) {
    results = results.filter((f) => filters.facilityTypes!.includes(f.facility_type));
  }
  if (filters.animalTypes?.length) {
    results = results.filter((f) => filters.animalTypes!.includes(f.animal_type));
  }
  if (filters.status?.length) {
    results = results.filter((f) => filters.status!.includes(f.status));
  }
  if (filters.adoption) {
    results = results.filter((f) => matchesTristate(f.adoption_available));
  }
  if (filters.volunteer) {
    results = results.filter((f) => matchesTristate(f.volunteer_available));
  }
  if (filters.donation) {
    results = results.filter((f) => matchesTristate(f.donation_available));
  }
  if (filters.supplies) {
    results = results.filter((f) => matchesTristate(f.supplies_available));
  }
  if (filters.visit) {
    results = results.filter((f) => matchesTristate(f.visit_available));
  }
  if (filters.foster) {
    results = results.filter((f) => matchesTristate(f.foster_help_available));
  }
  if (filters.query) {
    const q = filters.query.trim().toLowerCase();
    if (q) {
      results = results.filter((f) => {
        const haystack = [
          f.name,
          f.county,
          f.district ?? "",
          ...(f.alias ?? []),
          f.address ?? "",
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }
  }
  return results;
}

export interface FacilityStats {
  total: number;
  publicShelters: number;
  privateShelters: number;
  associations: number;
  fosterHomes: number;
  addressConfirmed: number;
  needsVerification: number;
  suspendedOrUnclear: number;
  verified: number;
}

export function getStats(facilities: Facility[] = ALL_FACILITIES): FacilityStats {
  const isPrivateShelter = (f: Facility) =>
    f.facility_type === "dog_shelter" ||
    f.facility_type === "private_rescue" ||
    f.facility_type === "dog_cat_rescue" ||
    f.facility_type === "other";

  return {
    total: facilities.length,
    publicShelters: facilities.filter((f) => f.facility_type === "public_shelter").length,
    privateShelters: facilities.filter(isPrivateShelter).length,
    associations: facilities.filter((f) => f.facility_type === "animal_protection_association" || f.facility_type === "animal_welfare_organization").length,
    fosterHomes: facilities.filter((f) => f.facility_type === "foster_home" || f.facility_type === "foster_network").length,
    addressConfirmed: facilities.filter((f) => !!f.address).length,
    needsVerification: facilities.filter((f) => f.verification_status === "needs_verification").length,
    suspendedOrUnclear: facilities.filter((f) => f.status === "suspended" || f.status === "unknown" || f.verification_status === "closed").length,
    verified: facilities.filter((f) => f.verification_status === "verified").length,
  };
}

export function getFacilitiesWithCoordinates(facilities: Facility[] = ALL_FACILITIES): Facility[] {
  return facilities.filter((f) => typeof f.latitude === "number" && typeof f.longitude === "number");
}

export function getVerificationBuckets(facilities: Facility[] = ALL_FACILITIES): Record<VerificationStatus, number> {
  const buckets: Record<VerificationStatus, number> = {
    verified: 0,
    partial_verified: 0,
    needs_verification: 0,
    closed: 0,
    unknown: 0,
  };
  for (const f of facilities) {
    buckets[f.verification_status] += 1;
  }
  return buckets;
}

export function getRecentUpdates(limit = 10) {
  return ALL_FACILITIES.flatMap((f) => (f.updates ?? []).map((u) => ({ ...u, facilityName: f.name, facilitySlug: f.slug })))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit);
}

export function getActiveSupplyNeeds(maxAgeDays = 30) {
  const now = new Date("2026-09-20T00:00:00+08:00").getTime();
  return ALL_FACILITIES.flatMap((f) =>
    (f.supply_needs ?? []).map((need) => {
      const ageDays = Math.floor((now - new Date(need.updated_at).getTime()) / (1000 * 60 * 60 * 24));
      return { ...need, facilityName: f.name, facilitySlug: f.slug, ageDays, isStale: ageDays > maxAgeDays };
    })
  );
}

/** Haversine 距離（公里），用於「找我附近」功能。 */
export function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getNearbyFacilities(lat: number, lon: number, radiusKm: number, facilities: Facility[] = ALL_FACILITIES) {
  return getFacilitiesWithCoordinates(facilities)
    .map((f) => ({ facility: f, distance: distanceKm(lat, lon, f.latitude!, f.longitude!) }))
    .filter((x) => x.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
}
