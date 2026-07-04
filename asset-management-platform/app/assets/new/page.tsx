"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import AssetForm from "@/components/assets/AssetForm";
import { createAsset } from "@/lib/assetService";
import type { AssetInput } from "@/lib/types";

export default function NewAssetPage() {
  const router = useRouter();

  async function handleCreate(values: AssetInput) {
    await createAsset(values);
    router.push("/assets");
  }

  return (
    <>
      <Header title="New Asset" description="Add a device to the asset register." />
      <AssetForm onSubmit={handleCreate} submitLabel="Create Asset" />
    </>
  );
}
