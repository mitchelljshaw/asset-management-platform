-- Asset Management Platform Database schema for Supabase
-- No login system, RLS is OFF and anon key is used for all access. see README. 

create extension if not exists pgcrypto;

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  asset_tag text not null unique,
  device_type text not null,
  brand text,
  model text,
  serial_number text,
  assigned_to text,
  location text,
  purchase_date date,
  warranty_expiry date,
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

create index if not exists idx_assets_status on assets (status);
create index if not exists idx_assets_device_type on assets (device_type);


