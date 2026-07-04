// Shapes of data used for the app, agreed assets

export const DEVICE_TYPES = [
  "Laptop",
  "Desktop",
  "Monitor",
  "Phone",
  "Tablet",
  "Printer",
  "Peripheral",
  "Other",
] as const;

export type DeviceType = (typeof DEVICE_TYPES)[number];

export const ASSET_STATUSES = [
  "Active",
  "Available",
  "In Repair",
  "Retired",
  "Lost",
] as const;

export type AssetStatus = (typeof ASSET_STATUSES)[number];

export interface Asset { // Matches the `assets` table in supabase/schema.sql

  id: string;
  asset_tag: string;
  device_type: DeviceType;
  brand: string | null;
  model: string | null;
  serial_number: string | null;
  assigned_to: string | null;
  location: string | null;
  purchase_date: string | null; // ISO date string, e.g. "2025-03-14"
  warranty_expiry: string | null; // ISO date string
  status: AssetStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type AssetInput = Omit<Asset, "id" | "created_at" | "updated_at">; // User fills form
