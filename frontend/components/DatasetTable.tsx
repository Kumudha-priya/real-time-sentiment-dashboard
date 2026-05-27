"use client";

import { useEffect, useState } from "react";

/* ---------------- TYPES ---------------- */

interface DataItem {
  text?: string;
  sentiment?: string;
  confidence_score?: number;
  topic_name?: string;
}

interface AnalyticsData {
  daily_trends?: {
    date: string;
    moving_avg_sentiment: number;
  }[];
}

type DatasetTableProps = {
  data: DataItem[];
};

/* ---------------- COMPONENT ---------------- */

export default function DatasetTable({ data }: DatasetTableProps) {
  // ---------------- STATES ----------------
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const rowsPerPage = 5;

  // ---------------- LOADING ----------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // ---------------- FETCH ANALYTICS ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/analytics");
        const result = await response.json();

        console.log("ANALYTICS:", result);
        setAnalytics(result);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      }
    };

    fetchData();
  }, []);

  // ---------------- PRIORITY DATA FIX ----------------
  const tableData: DataItem[] =
    data?.length > 0
      ? data
      : analytics?.daily_trends?.map((item) => ({
          text: item.date,
          sentiment: "Neutral",
          confidence_score: item.moving_avg_sentiment,
          topic_name: "Analytics",
        })) || [];

  // ---------------- LOADING UI ----------------
  if (loading) {
    return <div className="text-white p-10">Loading data...</div>;
  }

  // ---------------- EMPTY UI ----------------
  if (tableData.length === 0) {
    return <div className="text-white p-10">No data found.</div>;
  }

  // ---------------- FILTER ----------------
  const filteredData = tableData.filter((item) => {
    const matchesSearch = (item.text ?? "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || item.sentiment === filter;

    return matchesSearch && matchesFilter;
  });

  // ---------------- PAGINATION ----------------
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = filteredData.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  // ---------------- COLORS ----------------
 const getBadgeColor = (sentiment: string) => {
  if (sentiment === "Positive") {
    return "bg-green-500/20 text-green-300 border border-green-500/40 animate-pulse";
  }

  if (sentiment === "Negative") {
    return "bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse";
  }

  if (sentiment === "Trend") {
    return "bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse";
  }

  return "bg-gray-500/20 text-gray-300 border border-gray-500/40 animate-pulse";
};

  const getTopicColor = (topic: string) => {
  if (topic.includes("Analytics")) {
    return "px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse";
  }

  return "px-2 py-1 rounded-md bg-slate-700/40 text-slate-200 border border-slate-500/30";
};

  // ---------------- UI ----------------
  return (
    <div className="bg-gradient-to-br from-slate-900 to-gray-950 border border-slate-800 p-6 rounded-3xl shadow-2xl animate-fadeIn">

      <h2 className="text-2xl font-bold text-white mb-6">
        Dataset Analysis
      </h2>

      {/* FILTER */}
      <div className="flex gap-2 mb-6">
        {["All", "Positive", "Negative", "Neutral"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === type
                ? "bg-white text-black"
                : "bg-gray-800 text-white"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-3 rounded-lg bg-gray-800 text-white"
      />

      {/* TABLE */}
      <table className="w-full text-white border-separate border-spacing-y-2">
     <thead className="bg-slate-800/80">
    <tr className="text-gray-300">
      <th className="p-4 text-left rounded-l-xl w-[45%]">
        Post
      </th>

      <th className="p-4 text-center w-[20%]">
        Sentiment
      </th>

      <th className="p-4 text-center w-[15%]">
        Confidence
      </th>

      <th className="p-4 text-center rounded-r-xl w-[20%]">
        Topic
      </th>
    </tr>
  </thead>

  <tbody>
    {currentRows.map((item, index) => (
      <tr
  key={index}
  className="bg-slate-900/60 border border-slate-800 hover:bg-slate-800/50 transition-all duration-300"
>
        <td className="p-4 rounded-l-xl text-left">
          {item.text}
        </td>

        <td className="p-4 text-center">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold shadow-md transition-all duration-300 ${getBadgeColor(
              item.sentiment ?? "Neutral"
            )}`}
          >
            {item.sentiment}
          </span>
        </td>

        <td className="p-4 text-center font-semibold">
          {Number(item.confidence_score ?? 0).toFixed(2)}
        </td>

        <td className="p-4 text-center rounded-r-xl">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold shadow-md transition-all duration-300 ${getTopicColor(
              item.topic_name ?? ""
            )}`}
          >
            {item.topic_name}
          </span>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      {/* PAGINATION */}
      <div className="flex gap-4 justify-center mt-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-gray-700 rounded"
        >
          Prev
        </button>

        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-700 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}