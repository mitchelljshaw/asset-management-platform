import { Search } from "lucide-react";
import { ASSET_STATUSES, DEVICE_TYPES, type AssetStatus, type DeviceType } from "@/lib/types";

export const ALL_OPTION = "All" as const;

interface AssetFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: AssetStatus | typeof ALL_OPTION;
  onStatusChange: (value: AssetStatus | typeof ALL_OPTION) => void;
  deviceType: DeviceType | typeof ALL_OPTION;
  onDeviceTypeChange: (value: DeviceType | typeof ALL_OPTION) => void;
  location: string;
  onLocationChange: (value: string) => void;
  locationOptions: string[];
}

const selectClasses =
  "rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

export default function AssetFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  deviceType,
  onDeviceTypeChange,
  location,
  onLocationChange,
  locationOptions,
}: AssetFiltersProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 min-w-[220px]">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tag, brand, model, serial, or assignee..."
          className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as AssetStatus | typeof ALL_OPTION)}
        className={selectClasses}
      >
        <option value={ALL_OPTION}>All statuses</option>
        {ASSET_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={deviceType}
        onChange={(e) =>
          onDeviceTypeChange(e.target.value as DeviceType | typeof ALL_OPTION)
        }
        className={selectClasses}
      >
        <option value={ALL_OPTION}>All device types</option>
        {DEVICE_TYPES.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {locationOptions.length > 0 && (
        <select
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className={selectClasses}
        >
          <option value={ALL_OPTION}>All locations</option>
          {locationOptions.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
