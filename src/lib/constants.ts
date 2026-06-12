export const ROLES = [
  "ADMIN",
  "PROJECT_MANAGER",
  "SITE_SUPERVISOR",
  "PROCUREMENT",
  "HR",
] as const;

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  PROJECT_MANAGER: "Project Manager",
  SITE_SUPERVISOR: "Site Supervisor",
  PROCUREMENT: "Procurement",
  HR: "HR / Admin Staff",
};

export const TRADES = [
  "WELDER",
  "FABRICATOR",
  "PIPE_FITTER",
  "RIGGER",
  "ELECTRICIAN",
  "INSTRUMENT_TECH",
  "HELPER",
  "DRIVER",
  "OPERATOR",
  "OTHER",
] as const;

export const TRADE_LABELS: Record<string, string> = {
  WELDER: "Welder",
  FABRICATOR: "Fabricator",
  PIPE_FITTER: "Pipe Fitter",
  RIGGER: "Rigger",
  ELECTRICIAN: "Electrician",
  INSTRUMENT_TECH: "Instrument Technician",
  HELPER: "Helper",
  DRIVER: "Driver",
  OPERATOR: "Operator",
  OTHER: "Other",
};

export const MR_STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "PO_CREATED",
  "ORDERED",
  "IN_TRANSIT",
  "DELIVERED",
  "CLOSED",
  "REJECTED",
] as const;

export const MR_STATUS_LABELS: Record<string, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  PO_CREATED: "PO Created",
  ORDERED: "Ordered",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  CLOSED: "Closed",
  REJECTED: "Rejected",
};

/** Valid forward transitions of the material-request workflow. */
export const MR_TRANSITIONS: Record<string, string[]> = {
  SUBMITTED: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["APPROVED", "REJECTED"],
  APPROVED: ["PO_CREATED"],
  PO_CREATED: ["ORDERED"],
  ORDERED: ["IN_TRANSIT"],
  IN_TRANSIT: ["DELIVERED"],
  DELIVERED: ["CLOSED"],
  CLOSED: [],
  REJECTED: [],
};

export const PRIORITIES = ["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;

export const EQUIPMENT_CATEGORIES = [
  "MOBILE_CRANE",
  "FORKLIFT",
  "BOOM_LIFT",
  "SCISSOR_LIFT",
  "EXCAVATOR",
  "GENERATOR",
  "WELDING_MACHINE",
  "COMPRESSOR",
  "OTHER",
] as const;

export const EQUIPMENT_CATEGORY_LABELS: Record<string, string> = {
  MOBILE_CRANE: "Mobile Crane",
  FORKLIFT: "Forklift",
  BOOM_LIFT: "Boom Lift",
  SCISSOR_LIFT: "Scissor Lift",
  EXCAVATOR: "Excavator",
  GENERATOR: "Generator",
  WELDING_MACHINE: "Welding Machine",
  COMPRESSOR: "Compressor",
  OTHER: "Other",
};

export const ATTENDANCE_STATUSES = ["PRESENT", "ABSENT", "HALF_DAY", "LEAVE"] as const;

export const UNITS = ["pcs", "m", "m2", "m3", "kg", "ton", "ltr", "set", "roll", "box"] as const;

/** Normalize a date to midnight UTC for day-keyed records. */
export function dayKey(d: Date | string): Date {
  const date = new Date(d);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
