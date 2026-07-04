// Shared logic for the warranty expiry highlighting feature (Phase 6).
// Kept in one place so the table and any future page use the same rule for
// what counts as "expiring soon".

export type WarrantyState = "expired" | "expiring-soon" | "valid" | "unknown";

const EXPIRING_SOON_WINDOW_DAYS = 30;

export function getWarrantyState(warrantyExpiry: string | null): WarrantyState {
  if (!warrantyExpiry) return "unknown";

  const expiry = new Date(warrantyExpiry);
  if (Number.isNaN(expiry.getTime())) return "unknown";

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntilExpiry = (expiry.getTime() - Date.now()) / msPerDay;

  if (daysUntilExpiry < 0) return "expired";
  if (daysUntilExpiry <= EXPIRING_SOON_WINDOW_DAYS) return "expiring-soon";
  return "valid";
}

export const WARRANTY_STATE_STYLES: Record<WarrantyState, string> = {
  expired: "text-red-700 font-medium",
  "expiring-soon": "text-amber-700 font-medium",
  valid: "text-slate-700",
  unknown: "text-slate-400",
};

export const WARRANTY_STATE_LABELS: Record<WarrantyState, string> = {
  expired: "Expired",
  "expiring-soon": "Expiring soon",
  valid: "Valid",
  unknown: "No date on file",
};
