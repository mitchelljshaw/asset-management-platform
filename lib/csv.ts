import type { Asset } from "./types";

const CSV_COLUMNS: { header: string; get: (a: Asset) => string }[] = [
  { header: "Asset Tag", get: (a) => a.asset_tag },
  { header: "Device Type", get: (a) => a.device_type },
  { header: "Brand", get: (a) => a.brand ?? "" },
  { header: "Model", get: (a) => a.model ?? "" },
  { header: "Serial Number", get: (a) => a.serial_number ?? "" },
  { header: "Assigned To", get: (a) => a.assigned_to ?? "" },
  { header: "Location", get: (a) => a.location ?? "" },
  { header: "Purchase Date", get: (a) => a.purchase_date ?? "" },
  { header: "Warranty Expiry", get: (a) => a.warranty_expiry ?? "" },
  { header: "Status", get: (a) => a.status },
  { header: "Notes", get: (a) => (a.notes ?? "").replace(/\r?\n/g, " ") },
];

// Wraps a value in quotes and escapes any quotes inside it, per the CSV spec.
function escapeCsvValue(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function assetsToCsv(assets: Asset[]): string {
  const headerRow = CSV_COLUMNS.map((col) => escapeCsvValue(col.header)).join(",");
  const dataRows = assets.map((asset) =>
    CSV_COLUMNS.map((col) => escapeCsvValue(col.get(asset))).join(",")
  );
  return [headerRow, ...dataRows].join("\n");
}

// Triggers a browser download for the given CSV text. Only works client-side.
export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
