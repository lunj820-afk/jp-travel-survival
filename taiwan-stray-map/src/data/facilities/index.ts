import { PUBLIC_SHELTERS } from "./public-shelters";
import { PRIVATE_SHELTER_CANDIDATES, WHITE_MAMA_SHELTER } from "./private-shelters";
import { Facility } from "@/types/facility";

export const ALL_FACILITIES: Facility[] = [
  ...PUBLIC_SHELTERS,
  WHITE_MAMA_SHELTER,
  ...PRIVATE_SHELTER_CANDIDATES,
];

export { PUBLIC_SHELTERS, PRIVATE_SHELTER_CANDIDATES, WHITE_MAMA_SHELTER };
