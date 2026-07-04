import Link from "next/link";
import { Pencil } from "lucide-react";
import type { Asset } from "@/lib/types";
import AssetStatusBadge from "./AssetStatusBadge";
import {
  getWarrantyState,
  WARRANTY_STATE_STYLES,
  WARRANTY_STATE_LABELS,
} from "@/lib/warranty";

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AssetTable({ assets }: { assets: Asset[] }) {
  return (
    // overflow-x-auto lets the table scroll horizontally on small screens
    // instead of squashing every column unreadably.
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium">Asset Tag</th>
            <th className="px-4 py-3 font-medium">Device Type</th>
            <th className="px-4 py-3 font-medium">Brand / Model</th>
            <th className="px-4 py-3 font-medium">Serial Number</th>
            <th className="px-4 py-3 font-medium">Assigned To</th>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Warranty</th>
            <th className="px-4 py-3 font-medium text-right">Edit</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => {
            const warrantyState = getWarrantyState(asset.warranty_expiry);
            return (
              <tr key={asset.id} className="border-b border-border last:border-0 hover:bg-background">
                <td className="px-4 py-3 font-medium text-foreground">{asset.asset_tag}</td>
                <td className="px-4 py-3 text-foreground">{asset.device_type}</td>
                <td className="px-4 py-3 text-foreground">
                  {[asset.brand, asset.model].filter(Boolean).join(" ") || "—"}
                </td>
                <td className="px-4 py-3 text-muted">{asset.serial_number || "—"}</td>
                <td className="px-4 py-3 text-foreground">{asset.assigned_to || "—"}</td>
                <td className="px-4 py-3 text-foreground">{asset.location || "—"}</td>
                <td className="px-4 py-3">
                  <AssetStatusBadge status={asset.status} />
                </td>
                <td className={`px-4 py-3 ${WARRANTY_STATE_STYLES[warrantyState]}`}>
                  <span title={WARRANTY_STATE_LABELS[warrantyState]}>
                    {formatDate(asset.warranty_expiry)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/assets/${asset.id}/edit`}
                    className="inline-flex items-center gap-1 text-accent hover:underline"
                  >
                    <Pencil size={14} />
                    Edit
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
