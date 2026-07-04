// This file is the only place in the app that talks to the `assets` table
// directly. Pages and components call these functions instead of using the
// Supabase client themselves - if the database logic ever needs to change,
// it only needs to change here.

import { supabase } from "./supabaseClient";
import type { Asset, AssetInput } from "./types";

export async function getAssets(): Promise<Asset[]> {
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAssetById(id: string): Promise<Asset | null> {
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function createAsset(input: AssetInput): Promise<Asset> {
  const { data, error } = await supabase
    .from("assets")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateAsset(
  id: string,
  input: Partial<AssetInput>
): Promise<Asset> {
  const { data, error } = await supabase
    .from("assets")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Hard delete - permanently removes the row. Prefer archiveAsset() below
// unless the user explicitly wants the record gone (e.g. a duplicate entry).
export async function deleteAsset(id: string): Promise<void> {
  const { error } = await supabase.from("assets").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// Soft delete - keeps the row but marks it Retired. This is the safer
// default for real assets, since it preserves history instead of losing it.
export async function archiveAsset(id: string): Promise<Asset> {
  return updateAsset(id, { status: "Retired" });
}
