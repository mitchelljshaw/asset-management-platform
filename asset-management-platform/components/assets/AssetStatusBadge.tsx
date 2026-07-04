import type { AssetStatus } from "@/lib/types";

const STATUS_STYLES: Record<AssetStatus, string> = {
  Active: "bg-emerald-100 text-emerald-800",
  Available: "bg-blue-100 text-blue-800",
  "In Repair": "bg-amber-100 text-amber-800",
  Retired: "bg-slate-200 text-slate-700",
  Lost: "bg-red-100 text-red-800",
};

export default function AssetStatusBadge({ status }: { status: AssetStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
