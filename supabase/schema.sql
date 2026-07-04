-- Asset Management Platform - database schema
-- Run this once in your Supabase project's SQL Editor (Project -> SQL Editor -> New query).

-- Lets Postgres generate UUIDs for us (gen_random_uuid).
create extension if not exists pgcrypto;

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),

  -- A short human-readable code staff use to refer to the device, e.g. "LAP-0123".
  -- Unique so the same tag can't accidentally be used twice.
  asset_tag text not null unique,

  device_type text not null,
  brand text,
  model text,
  serial_number text,

  -- Free text for V1 (e.g. a person's name or "IT Storage Room").
  -- A dedicated employees table is a natural future upgrade - see README.
  assigned_to text,
  location text,

  purchase_date date,
  warranty_expiry date,

  -- Defaults to "Available" so a newly added, unassigned device has a
  -- sensible status without the form forcing a choice.
  status text not null default 'Available',

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint assets_status_check
    check (status in ('Active', 'Available', 'In Repair', 'Retired', 'Lost')),

  constraint assets_device_type_check
    check (device_type in
      ('Laptop', 'Desktop', 'Monitor', 'Phone', 'Tablet', 'Printer', 'Peripheral', 'Other'))
);

-- Keeps updated_at accurate automatically, instead of trusting every write
-- to set it correctly.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists assets_set_updated_at on assets;
create trigger assets_set_updated_at
  before update on assets
  for each row
  execute function set_updated_at();

-- Speeds up the dashboard counts and the status/device type filters.
create index if not exists idx_assets_status on assets (status);
create index if not exists idx_assets_device_type on assets (device_type);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- There's no login system yet in V1 (see README "Future improvements"), so
-- this table intentionally has RLS left OFF and is accessed with the public
-- anon key. That is fine for a local/demo project, but is NOT safe to expose
-- publicly on the internet as-is: anyone with the anon key could read and
-- write every row. Before adding real users, either:
--   1. Enable Supabase Auth and add RLS policies scoped to auth.uid(), or
--   2. Move writes behind a server-side API route using the service role key.
-- alter table assets enable row level security;
