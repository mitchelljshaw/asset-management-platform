"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Download } from "lucide-react";
import Header from "@/components/layout/Header";
import AssetTable from "@/components/assets/AssetTable";
import AssetFilters, { ALL_OPTION } from "@/components/assets/AssetFilters";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/StateMessage";
import { getAssets } from "@/lib/assetService";
import { assetsToCsv, downloadCsv } from "@/lib/csv";
import type { Asset, AssetStatus, DeviceType } from "@/lib/types";

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AssetStatus | typeof ALL_OPTION>(ALL_OPTION);
  const [deviceType, setDeviceType] = useState<DeviceType | typeof ALL_OPTION>(ALL_OPTION);
  const [location, setLocation] = useState<string>(ALL_OPTION);

  // No setState call happens before the first `await` here, which keeps
  // this safe to call directly from the effect below.
  async function fetchAssets() {
    try {
      const data = await getAssets();
      setAssets(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assets.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAssets();
  }, []);

  function handleRetry() {
    setLoading(true);
    setError(null);
    fetchAssets();
  }

  const locationOptions = useMemo(() => {
    const unique = new Set(assets.map((a) => a.location).filter((loc): loc is string => Boolean(loc)));
    return Array.from(unique).sort();
  }, [assets]);

  // Simple client-side filtering. This is fine for a V1 with a modest number
  // of assets; a larger dataset would move this to a server-side query
  // (Supabase .ilike()/.eq() filters) instead of filtering in the browser.
  const filteredAssets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return assets.filter((asset) => {
      const matchesSearch =
        query.length === 0 ||
        [asset.asset_tag, asset.brand, asset.model, asset.serial_number, asset.assigned_to]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(query));

      const matchesStatus = status === ALL_OPTION || asset.status === status;
      const matchesDeviceType = deviceType === ALL_OPTION || asset.device_type === deviceType;
      const matchesLocation = location === ALL_OPTION || asset.location === location;

      return matchesSearch && matchesStatus && matchesDeviceType && matchesLocation;
    });
  }, [assets, search, status, deviceType, location]);

  function handleExportCsv() {
    const csv = assetsToCsv(filteredAssets);
    const today = new Date().toISOString().slice(0, 10);
    downloadCsv(`assets-${today}.csv`, csv);
  }

  const hasAnyAssets = assets.length > 0;
  const hasFilteredResults = filteredAssets.length > 0;

  return (
    <>
      <Header
        title="Assets"
        description="Every device your organisation owns, in one place."
        actions={
          <>
            <button
              onClick={handleExportCsv}
              disabled={!hasFilteredResults}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} />
              Export CSV
            </button>
            <Link
              href="/assets/new"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
            >
              <Plus size={16} />
              New Asset
            </Link>
          </>
        }
      />

      {loading && <LoadingState label="Loading assets..." />}
      {!loading && error && <ErrorState message={error} onRetry={handleRetry} />}

      {!loading && !error && (
        <>
          <AssetFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            deviceType={deviceType}
            onDeviceTypeChange={setDeviceType}
            location={location}
            onLocationChange={setLocation}
            locationOptions={locationOptions}
          />

          {!hasAnyAssets && (
            <EmptyState
              title="No assets yet"
              description="Add your first device to start tracking it here."
              action={
                <Link
                  href="/assets/new"
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
                >
                  <Plus size={16} />
                  Add an asset
                </Link>
              }
            />
          )}

          {hasAnyAssets && !hasFilteredResults && (
            <EmptyState
              title="No assets match your filters"
              description="Try a different search term or clear the filters above."
            />
          )}

          {hasFilteredResults && <AssetTable assets={filteredAssets} />}
        </>
      )}
    </>
  );
}
