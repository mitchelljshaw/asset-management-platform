"use client";

import { useEffect, useState } from "react";
import { Boxes, CheckCircle2, Archive, Wrench } from "lucide-react";
import Header from "@/components/layout/Header";
import SummaryCard from "@/components/dashboard/SummaryCard";
import { LoadingState, ErrorState } from "@/components/ui/StateMessage";
import { getAssets } from "@/lib/assetService";
import type { Asset } from "@/lib/types";

interface Summary {
  total: number;
  active: number;
  retired: number;
  inRepair: number;
}

function summarise(assets: Asset[]): Summary { // Counts asset by status for card
  return {
    total: assets.length,
    active: assets.filter((a) => a.status === "Active").length,
    retired: assets.filter((a) => a.status === "Retired").length,
    inRepair: assets.filter((a) => a.status === "In Repair").length,
  };
}

export default function DashboardPage() { // Dashboard page with summary cards
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchSummary() { // Loads assets and creates dashboard summary
    try {
      const assets = await getAssets();
      setSummary(summarise(assets));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assets.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { // Loads dashboard data on page load
    fetchSummary();
  }, []);

  function handleRetry() { // Reloads dashboard after error
    setLoading(true);
    setError(null);
    fetchSummary();
  }

  return (
    <>
      <Header
        title="Dashboard"
        description="A snapshot of every device your organisation owns."
      />

      {loading && <LoadingState label="Loading dashboard..." />}
      {!loading && error && <ErrorState message={error} onRetry={handleRetry} />}

      {!loading && !error && summary && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Total Assets" value={summary.total} icon={Boxes} />
          <SummaryCard
            label="Active Assets"
            value={summary.active}
            icon={CheckCircle2}
            accent="success"
          />
          <SummaryCard
            label="In Repair"
            value={summary.inRepair}
            icon={Wrench}
            accent="warning"
          />
          <SummaryCard
            label="Retired Assets"
            value={summary.retired}
            icon={Archive}
            accent="danger"
          />
        </div>
      )}
    </>
  );
}
