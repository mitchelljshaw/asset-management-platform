// Database logic only to be changed here. UI Logic in components folder. 

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

export async function deleteAsset(id: string): Promise<void> { // Hard delete - permanently removes the row
  const { error } = await supabase.from("assets").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function archiveAsset(id: string): Promise<Asset> { // Soft delete - keeps the row but marks it Retired.
  return updateAsset(id, { status: "Retired" });
}
