"use client";

import DatasetTable from "../components/DatasetTable";
import { useDashboard } from "@/hooks/useDashboard";

export default function Home() {
  const { data } = useDashboard();

  // anomalies count
  const anomalies = data?.alerts ?? [];

  // correct dataset mapping
  const dataset = (data?.alerts ?? []).map((item) => ({
  text: (item as unknown as { date?: string }).date || "Unknown Date",
  sentiment: "Anomaly",
  confidence_score:
    (item as unknown as { z_score?: number }).z_score || 0,
  topic_name: "Alert",
}));
  return (
    <div className="p-8 bg-black min-h-screen">
      <h1 className="text-5xl font-bold text-white mb-10">
  Real-Time Anomaly Monitor
</h1>

      {/* ANOMALY CARD */}
<div className="bg-gradient-to-r from-yellow-500 to-amber-600 shadow-[0_0_30px_rgba(245,158,11,0.25)] p-6 rounded-3xl mb-10 text-white max-w-md">
  <p className="text-lg font-semibold">Anomalies</p>

  <h2 className="text-4xl">{anomalies.length}</h2>

  <p className="text-sm opacity-80 mt-2">
    Unusual activity spikes detected by AI anomaly analysis.
  </p>
</div>

      {/* TABLE */}
      <DatasetTable data={dataset} />

    </div>
  );
}