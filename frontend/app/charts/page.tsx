"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

// ✅ FIXED TYPES (NO any errors now)
type TrendItem = {
  date: string;
  platform?: string;
  sentiment?: string;
  count: number;
  moving_avg_sentiment?: number;
};

type AlertItem = {
  date: string;
  post_volume: number;
};

type BrandAlert = {
  alert: string;
  brand?: string;
  count: number;
};

type Analytics = {
  daily_trends: TrendItem[];
  weekly_trends: TrendItem[];
  platform_trends: { platform: string; count: number }[];
  brand_trends: {
  brand: string;
  count: number;
}[];

  alerts: AlertItem[];
  brand_alerts: BrandAlert[];

  topic_frequency: {
    topic: string;
    count: number;
  }[];

  keyword_frequency: {
    keyword: string;
    count: number;
  }[];

  sentiment_distribution: {
  Positive: number;
  Neutral: number;
  Negative: number;
};
};

export default function ChartsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://127.0.0.1:8000/analytics");

        if (!res.ok) throw new Error("API failed");

        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Unknown error occurred");
  }
} finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-xl font-bold">
        Loading Charts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-red-500 font-bold">
        {error}
      </div>
    );
  }

  if (!analytics) return null;

const COLORS = ["#22c55e", "#ef4444", "#3b82f6"];

const sentimentChartData = [
  {
    name: "Positive",
    value: analytics.sentiment_distribution.Positive,
  },
  {
    name: "Neutral",
    value: analytics.sentiment_distribution.Neutral,
  },
  {
    name: "Negative",
    value: analytics.sentiment_distribution.Negative,
  },
];

  return (
    <div className="p-6 space-y-8 bg-gray-100 min-h-screen">

      <h1 className="text-4xl font-bold">
        Analytics Dashboard
      </h1>

      {/* DAILY TREND */}
      <div className="bg-white p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <h2 className="text-2xl font-bold mb-4">
          Daily Sentiment Trend
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.daily_trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
           <Tooltip
  contentStyle={{
    borderRadius: "12px",
    border: "none",
  }}
/>
            <Legend />
            <Line
  type="monotone"
  dataKey="count"
  stroke="#2563eb"
  strokeWidth={3}
  animationDuration={2000}
  animationEasing="ease-in-out"
/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* PLATFORM PIE */}
      <div className="bg-white p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <h2 className="text-2xl font-bold mb-4">
          Platform Comparison
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={analytics.platform_trends}
              dataKey="count"
              nameKey="platform"
              outerRadius={140}
              label={({ name, percent }) =>
             `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
             }
            >
              {analytics.platform_trends.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                
              ))}
            </Pie>

            <Tooltip
  contentStyle={{
    borderRadius: "12px",
    border: "none",
  }}
/>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* STACKED SENTIMENT CHART */}
<div className="bg-white p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
  <h2 className="text-2xl font-bold mb-4">
    Sentiment Distribution
  </h2>

  <ResponsiveContainer width="100%" height={320}>
  <PieChart>
    <Pie
      data={sentimentChartData}
      dataKey="value"
      nameKey="name"
      outerRadius={120}
      label
    >
      {sentimentChartData.map((_, i) => (
        <Cell
          key={i}
          fill={COLORS[i % COLORS.length]}
        />
      ))}
    </Pie>

    <Tooltip
      contentStyle={{
        borderRadius: "12px",
        border: "none",
      }}
    />

    <Legend />
  </PieChart>
</ResponsiveContainer>
</div>
      {/* BRAND TRENDS */}
<div className="bg-white p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
  <h2 className="text-2xl font-bold mb-4">
    Brand Sentiment Trends
  </h2>

  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={analytics.brand_trends}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="brand" />
      <YAxis />
      <Tooltip
  contentStyle={{
    borderRadius: "12px",
    border: "none",
  }}
/>
      <Legend />

      <Bar
  dataKey="count"
  fill="#f59e0b"
  name="Brand Mentions"
  isAnimationActive={true}
  animationDuration={2000}
/>
    </BarChart>
  </ResponsiveContainer>
</div>
      {/* TOPIC FREQUENCY */}
<div className="bg-white p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
  <h2 className="text-2xl font-bold mb-4">
    Topic Frequency
  </h2>

  <ResponsiveContainer width="100%" height={280}>
    <BarChart data={analytics.topic_frequency}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="topic" />
      <YAxis />
      <Tooltip
  contentStyle={{
    borderRadius: "12px",
    border: "none",
  }}
/>
      <Legend />

      <Bar
  dataKey="count"
  name="Topic Count"
  fill="#3b82f6"
  isAnimationActive={true}
  animationDuration={2000}
/>
    </BarChart>
  </ResponsiveContainer>
</div>
{/* KEYWORD FREQUENCY */}
<div className="bg-white p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
  <h2 className="text-2xl font-bold mb-4">
    Keyword Frequency
  </h2>

  <ResponsiveContainer width="100%" height={280}>
    <BarChart data={analytics.keyword_frequency}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="keyword" />
      <YAxis />
      <Tooltip
  contentStyle={{
    borderRadius: "12px",
    border: "none",
  }}
/>
      <Legend />

      <Bar
  dataKey="count"
  name="Keyword Count"
  fill="#8b5cf6"
  isAnimationActive={true}
  animationDuration={2000}
/>
    </BarChart>
  </ResponsiveContainer>
</div>
{/* KEYWORD BUBBLE VISUALIZATION */}
<div className="bg-white p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
  <h2 className="text-2xl font-bold mb-6">
    Keyword Visualization
  </h2>

  <div className="flex flex-wrap gap-6 justify-center items-center min-h-[300px]">

    {analytics.keyword_frequency.map((item, index) => (
      <div
        key={index}
        className="flex items-center justify-center rounded-full text-white font-bold transition-all duration-300 hover:scale-110"
        style={{
          width: `${item.count / 8}px`,
          height: `${item.count / 8}px`,
          backgroundColor: [
            "#3b82f6",
            "#22c55e",
            "#ef4444",
            "#8b5cf6",
            "#f59e0b",
          ][index % 5],
          minWidth: "80px",
          minHeight: "80px",
        }}
      >
        {item.keyword}
      </div>
    ))}

  </div>
</div>
      {/* MOVING AVERAGE */}
      <div className="bg-white p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <h2 className="text-2xl font-bold mb-4">
          Moving Average Sentiment
        </h2>

        <ResponsiveContainer width="100%" height={300}>
  <AreaChart data={analytics.daily_trends}>
    <CartesianGrid strokeDasharray="3 3" />

    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip
  contentStyle={{
    borderRadius: "12px",
    border: "none",
  }}
/>
    <Legend />

    <Area
  type="monotone"
  dataKey="moving_avg_sentiment"
  name="Moving Avg Sentiment"
  stroke="#16a34a"
  fill="#86efac"
  animationDuration={2500}
  animationEasing="ease-in-out"
/>
  </AreaChart>
</ResponsiveContainer>
      </div>

      {/* SPIKES */}
      <div className="bg-white p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <h2 className="text-2xl font-bold mb-4">
          Spike Detection
        </h2>

        <ResponsiveContainer width="100%" height={250}>
  <BarChart data={analytics.alerts}>
    <CartesianGrid strokeDasharray="3 3" />

    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip
  contentStyle={{
    borderRadius: "12px",
    border: "none",
  }}
/>
    <Legend />

    <Bar
  dataKey="post_volume"
  fill="#ef4444"
  isAnimationActive={true}
  animationDuration={1800}
/>
  </BarChart>
</ResponsiveContainer>
      </div>

      {/* ALERTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {analytics.brand_alerts.slice(0, 6).map((alert, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-bold mb-2">
              {alert.alert}
            </h3>

            <p>Brand: {alert.brand || "N/A"}</p>
            <p>Count: {alert.count}</p>
          </div>
        ))}
      </div>

    </div>
  );
}