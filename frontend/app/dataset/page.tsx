"use client";

import DatasetTable from "../../components/DatasetTable";

export default function DatasetPage() {

  const dataset = [
    {
      text: "AI analytics are improving rapidly",
      sentiment: "Positive",
      confidence_score: 95.2,
      topic_name: "Analytics",
    },
    {
      text: "Users are unhappy with recent updates",
      sentiment: "Negative",
      confidence_score: 88.4,
      topic_name: "Trends",
    },
    {
      text: "Dashboard traffic remains stable",
      sentiment: "Neutral",
      confidence_score: 72.1,
      topic_name: "Monitoring",
    },
    {
      text: "Customer engagement increased today",
      sentiment: "Positive",
      confidence_score: 91.7,
      topic_name: "Growth",
    },
    {
      text: "Some unusual activity detected",
      sentiment: "Negative",
      confidence_score: 83.5,
      topic_name: "Alerts",
    },
  ];

  return (
    <div className="p-8 bg-black min-h-screen">

      <h1 className="text-5xl font-bold text-white mb-10">
        Sentiment Analysis Dataset
      </h1>

      <DatasetTable data={dataset} />

    </div>
  );
}