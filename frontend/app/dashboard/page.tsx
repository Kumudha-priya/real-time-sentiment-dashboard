"use client";

import DatasetTable from "@/components/DatasetTable";
import { useDashboard } from "@/hooks/useDashboard";

type TrendItem = {
  date: string;
  count: number;
  moving_avg_sentiment: number;
};

type SentimentTotals = {
  Positive: number;
  Negative: number;
  Neutral: number;
};

export default function Dashboard() {
  const { data, loading, error } = useDashboard();

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading dashboard data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-400">
        <h2 className="text-2xl mb-4">{error}</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  // ================= SAFE NORMALIZATION =================

  const sentimentRaw = data.sentiment_distribution;

  let totals: SentimentTotals = {
    Positive: 0,
    Negative: 0,
    Neutral: 0,
  };

  // ✔ CASE 1: array
  if (Array.isArray(sentimentRaw)) {
    for (const item of sentimentRaw) {
      totals.Positive += item.Positive ?? 0;
      totals.Negative += item.Negative ?? 0;
      totals.Neutral += item.Neutral ?? 0;
    }
  }

  // ✔ CASE 2: object
  else if (sentimentRaw && typeof sentimentRaw === "object") {
    const obj = sentimentRaw as SentimentTotals;

    totals = {
      Positive: obj.Positive ?? 0,
      Negative: obj.Negative ?? 0,
      Neutral: obj.Neutral ?? 0,
    };
  }

  // ================= TRENDS =================

  const trendArray: TrendItem[] = Array.isArray(data.daily_trends)
    ? data.daily_trends
    : [];

  const tableData = trendArray.map((item) => ({
    text: item?.date ?? "No Date",
    sentiment: "Trend",
    confidence_score: item?.moving_avg_sentiment ?? 0,
    topic_name: "Analytics",
  }));

  const avgConfidence =
    trendArray.length > 0
      ? trendArray.reduce(
          (acc, curr) => acc + (curr?.moving_avg_sentiment ?? 0),
          0
        ) / trendArray.length
      : 0;

  // ================= UI =================

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">

      <div className="w-64 bg-black/40 p-6 hidden lg:block">
        <h2 className="text-3xl font-bold mb-10">
          AI Monitor
        </h2>
      </div>

      <div className="flex-1 p-8">

        <h1 className="text-5xl font-bold mb-10">
          Sentiment Dashboard
        </h1>

        <div className="grid grid-cols-4 gap-6">

          <div className="bg-emerald-600 p-6 rounded-3xl">
            Positive
            <h2 className="text-4xl">{totals.Positive}</h2>
          </div>

          <div className="bg-red-600 p-6 rounded-3xl">
            Negative
            <h2 className="text-4xl">{totals.Negative}</h2>
          </div>

          <div className="bg-slate-600 p-6 rounded-3xl">
            Neutral
            <h2 className="text-4xl">{totals.Neutral}</h2>
          </div>

          <div className="bg-blue-600 p-6 rounded-3xl">
            Avg Confidence
            <h2 className="text-4xl">
              {avgConfidence.toFixed(2)}
            </h2>
          </div>

        </div>

        <div className="mt-10">
          <DatasetTable data={tableData} />
        </div>

      </div>
    </div>
  );
}