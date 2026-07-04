import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // This throws at build/runtime instead of silently failing, so a missing
  // .env.local shows up immediately as a clear error rather than confusing
  // "fetch failed" bugs deep in a component.
  throw new Error(
    "Missing Supabase environment variables. Copy .env.example to .env.local " +
      "and fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

// The anon key is safe to expose in the browser - it's public by design and
// relies on Supabase Row Level Security (RLS) to control access. See the
// README for the current RLS status of this project.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
