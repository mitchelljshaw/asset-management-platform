"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Archive, Trash2 } from "lucide-react";
import Header from "@/components/layout/Header";
import AssetForm from "@/components/assets/AssetForm";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/StateMessage";
import { getAssetById, updateAsset, archiveAsset, deleteAsset } from "@/lib/assetService";
import type { Asset, AssetInput } from "@/lib/types";

export default function EditAssetPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const assetId = params.id;

  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState(false);

  // No setState call happens before the first `await` here, which keeps
  // this safe to call directly from the effect below.
  async function fetchAsset() {
    try {
      const data = await getAssetById(assetId);
      setAsset(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load this asset.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAsset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId]);

  function handleRetry() {
    setLoading(true);
    setError(null);
    fetchAsset();
  }

  async function handleUpdate(values: AssetInput) {
    await updateAsset(assetId, values);
    router.push("/assets");
  }

  async function handleArchive() {
    if (!confirm("Set this asset's status to Retired? It will stay in the system but won't count as active.")) {
      return;
    }
    setActionPending(true);
    setActionError(null);
    try {
      await archiveAsset(assetId);
      router.push("/assets");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to archive this asset.");
      setActionPending(false);
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        "Permanently delete this asset? This can't be undone. Consider Archive instead if you want to keep a record of it."
      )
    ) {
      return;
    }
    setActionPending(true);
    setActionError(null);
    try {
      await deleteAsset(assetId);
      router.push("/assets");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete this asset.");
      setActionPending(false);
    }
  }

  return (
    <>
      <Header
        title="Edit Asset"
        description={asset ? `Editing ${asset.asset_tag}` : "Update this device's details."}
        actions={
          asset && (
            <>
              <button
                onClick={handleArchive}
                disabled={actionPending}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Archive size={16} />
                Archive
              </button>
              <button
                onClick={handleDelete}
                disabled={actionPending}
                className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </>
          )
        }
      />

      {loading && <LoadingState label="Loading asset..." />}
      {!loading && error && <ErrorState message={error} onRetry={handleRetry} />}
      {!loading && !error && !asset && (
        <EmptyState title="Asset not found" description="It may have been deleted already." />
      )}

      {actionError && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {actionError}
        </p>
      )}

      {!loading && !error && asset && (
        <AssetForm initialValues={asset} onSubmit={handleUpdate} submitLabel="Save Changes" />
      )}
    </>
  );
}
