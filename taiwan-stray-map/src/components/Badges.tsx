import {
  Facility,
  FACILITY_TYPE_ICON,
  FACILITY_TYPE_LABELS,
  STATUS_COLOR,
  STATUS_LABELS,
  TRISTATE_LABELS,
  TriState,
  VERIFICATION_COLOR,
  VERIFICATION_LABELS,
} from "@/types/facility";

export function VerificationBadge({ status }: { status: Facility["verification_status"] }) {
  const color = VERIFICATION_COLOR[status];
  const dot = color === "green" ? "🟢" : color === "yellow" ? "🟡" : color === "orange" ? "🟠" : color === "red" ? "🔴" : "⚪";
  return <span className={`badge badge-${color}`}>{dot} {VERIFICATION_LABELS[status]}</span>;
}

export function StatusBadge({ status }: { status: Facility["status"] }) {
  const color = STATUS_COLOR[status];
  const dot = color === "green" ? "🟢" : color === "yellow" ? "🟡" : color === "orange" ? "🟠" : color === "red" ? "🔴" : "⚪";
  return <span className={`badge badge-${color}`}>{dot} {STATUS_LABELS[status]}</span>;
}

export function FacilityTypeBadge({ type }: { type: Facility["facility_type"] }) {
  return (
    <span className="badge badge-gray">
      {FACILITY_TYPE_ICON[type]} {FACILITY_TYPE_LABELS[type]}
    </span>
  );
}

export function TriStateLine({ label, icon, value }: { label: string; icon: string; value: TriState }) {
  const color = value === "yes" ? "green" : value === "conditional" ? "yellow" : value === "no" ? "red" : "gray";
  return (
    <div className="flex items-center justify-between text-sm py-1">
      <span className="text-coffee">{icon} {label}</span>
      <span className={`badge badge-${color}`}>{TRISTATE_LABELS[value]}</span>
    </div>
  );
}
