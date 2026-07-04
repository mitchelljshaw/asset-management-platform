# Asset Manager

A full-stack internal IT asset management app for tracking company equipment such as laptops, monitors, phones, printers, and peripherals.

The app is designed like a small business or IT support team tool, replacing unreliable spreadsheets with a structured database, searchable asset list, dashboard, validation, and asset lifecycle actions.

## Features

- Dashboard showing total, active, in repair, and retired assets
- Searchable and filterable asset table
- Filter by status, device type, and location
- Create and edit assets through a validated form
- Archive assets by setting their status to `Retired`
- Permanently delete assets with confirmation
- Warranty expiry highlighting for expired and expiring-soon assets
- CSV export of the currently filtered asset list
- Loading, error, and empty states across data-driven pages
- Fully typed with TypeScript from database rows to UI components

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- Supabase
- PostgreSQL
- lucide-react

## Project Structure

```text
app/
  page.tsx                  Dashboard
  assets/page.tsx           Asset list, search, filters, CSV export
  assets/new/page.tsx       Create asset
  assets/[id]/edit/page.tsx Edit, archive, and delete assets

components/
  layout/                   App shell, sidebar, header
  dashboard/                Dashboard summary cards
  assets/                   Asset table, form, filters, status badge
  ui/                       Shared loading, error, and empty states

lib/
  types.ts                  Shared TypeScript types
  supabaseClient.ts         Supabase browser client
  assetService.ts           Database access layer
  warranty.ts               Warranty status helpers
  csv.ts                    CSV export helper

supabase/
  schema.sql                PostgreSQL schema

## Running Locally

This project uses Supabase for the database. To run it locally, create a free Supabase project, run the SQL schema in `supabase/schema.sql`, and add your Supabase URL and anon key to `.env.local`.