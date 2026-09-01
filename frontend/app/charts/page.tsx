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
type SentimentItem = {
  platform: string;
  Positive: number;
  Neutral: number;
  Negative: number;
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

        const token = localStorage.getItem("token");

const analyticsRes = await fetch(
  "http://127.0.0.1:8000/analytics",
  {
    headers:{
      Authorization:`Bearer ${token}`
    }
  }
);


const sentimentRes = await fetch(
  "http://127.0.0.1:8000/sentiments"
);

const analyticsData: Analytics = await analyticsRes.json();

const sentimentData: SentimentItem[] =
await sentimentRes.json();


const sentimentDistribution = sentimentData.reduce(
  (acc, item)=>{

    acc.Positive += item.Positive;
    acc.Neutral += item.Neutral;
    acc.Negative += item.Negative;

    return acc;

  },
  {
    Positive:0,
    Neutral:0,
    Negative:0
  }
);


setAnalytics({
  ...analyticsData,
  sentiment_distribution: sentimentDistribution
});


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
  console.log("TOPIC FREQUENCY:", analytics.topic_frequency);

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
    <div className="p-6 space-y-8 bg-slate-100 min-h-screen text-slate-900">

    <h1 className="text-4xl font-bold text-slate-900">
      
        Analytics Dashboard
      </h1>

      {/* DAILY TREND */}
      <div className="bg-white text-slate-900 p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">
          Daily Sentiment Trend
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.daily_trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
           <Tooltip
 contentStyle={{
    background:"#ffffff",
    color:"#0f172a",
    borderRadius:"12px",
    border:"1px solid #cbd5e1",
 }}
 labelStyle={{
    color:"#0f172a"
 }}
/>
            <Legend
 wrapperStyle={{
   color:"#334155"
 }}
/>
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
      <div className="bg-white text-slate-900 p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
       <h2 className="text-2xl font-bold mb-4 text-slate-900">
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
    background:"#ffffff",
    color:"#0f172a",
    borderRadius:"12px",
    border:"1px solid #cbd5e1",
 }}
 labelStyle={{
    color:"#0f172a"
 }}
/>
            
           <Legend
 wrapperStyle={{
   color:"#334155"
 }}
/>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* STACKED SENTIMENT CHART */}
<div className="bg-white text-slate-900 p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
  <h2 className="text-2xl font-bold mb-4 text-slate-900">
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
    background:"#ffffff",
    color:"#0f172a",
    borderRadius:"12px",
    border:"1px solid #cbd5e1",
 }}
 labelStyle={{
    color:"#0f172a"
 }}
/>

    <Legend
 wrapperStyle={{
   color:"#334155"
 }}
/>
  </PieChart>
</ResponsiveContainer>
</div>
      {/* BRAND TRENDS */}
<div className="bg-white text-slate-900 p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
  <h2 className="text-2xl font-bold mb-4 text-slate-900">
    Brand Sentiment Trends
  </h2>

  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={analytics.brand_trends}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="brand" />
      <YAxis />
      
  <Tooltip
 contentStyle={{
    background:"#ffffff",
    color:"#0f172a",
    borderRadius:"12px",
    border:"1px solid #cbd5e1",
 }}
 labelStyle={{
    color:"#0f172a"
 }}
/>
     <Legend
 wrapperStyle={{
   color:"#334155"
 }}
/> 

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
<div className="bg-white text-slate-900 p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
  <h2 className="text-2xl font-bold mb-4 text-slate-900">
    Topic Frequency
  </h2>

  <ResponsiveContainer width="100%" height={280}>
    <BarChart
 data={analytics.topic_frequency
   .sort((a,b)=>b.count-a.count)
   .slice(0,10)}
>
      <CartesianGrid strokeDasharray="3 3" />

     <XAxis
 dataKey="topic"
 tick={{fill:"#334155"}}
 angle={-45}
 textAnchor="end"
 interval={0}
 height={120}
/>

<YAxis />

     <Tooltip
 contentStyle={{
    background:"#ffffff",
    color:"#0f172a",
    borderRadius:"12px",
    border:"1px solid #cbd5e1",
 }}
 labelStyle={{
    color:"#0f172a"
 }}
/>
     <Legend
 wrapperStyle={{
   color:"#334155"
 }}
/>

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
<div className="bg-white text-slate-900 p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
 <h2 className="text-2xl font-bold mb-4 text-slate-900">
    Keyword Frequency
  </h2>

  <ResponsiveContainer width="100%" height={280}>
    <BarChart
  data={analytics.keyword_frequency
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)}
>
      <CartesianGrid strokeDasharray="3 3" />

     <XAxis
 dataKey="keyword"
 tick={{fill:"#334155"}}
 angle={-45}
 textAnchor="end"
 interval={0}
 height={120}
/>
      <YAxis />
      <Tooltip
 contentStyle={{
    background:"#ffffff",
    color:"#0f172a",
    borderRadius:"12px",
    border:"1px solid #cbd5e1",
 }}
 labelStyle={{
    color:"#0f172a"
 }}
/>
      <Legend
 wrapperStyle={{
   color:"#334155"
 }}
/>

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
<div className="bg-white text-slate-900 p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
  <h2 className="text-2xl font-bold mb-6">
    Keyword Visualization
  </h2>

  <div className="flex flex-wrap gap-6 justify-center items-center min-h-[300px]">

    {analytics.keyword_frequency
  .sort((a, b) => b.count - a.count)
  .slice(0, 30)
  .map((item, index) => (
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
      <div className="bg-white text-slate-900 p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">
          Moving Average Sentiment
        </h2>

        <ResponsiveContainer width="100%" height={300}>
  <AreaChart data={analytics.daily_trends}>
    <CartesianGrid strokeDasharray="3 3" />

    <XAxis dataKey="date" />
    <YAxis />
    
  <Tooltip
 contentStyle={{
    background:"#ffffff",
    color:"#0f172a",
    borderRadius:"12px",
    border:"1px solid #cbd5e1",
 }}
 labelStyle={{
    color:"#0f172a"
 }}
/>
   <Legend
 wrapperStyle={{
   color:"#334155"
 }}
/> 

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
      <div className="bg-white text-slate-900 p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
       <h2 className="text-2xl font-bold mb-4 text-slate-900">
          Spike Detection
        </h2>

        <ResponsiveContainer width="100%" height={250}>
  <BarChart data={analytics.alerts}>
    <CartesianGrid strokeDasharray="3 3" />

    <XAxis dataKey="date" />
    <YAxis />
   <Tooltip
 contentStyle={{
    background:"#ffffff",
    color:"#0f172a",
    borderRadius:"12px",
    border:"1px solid #cbd5e1",
 }}
 labelStyle={{
    color:"#0f172a"
 }}
/>
    <Legend
 wrapperStyle={{
   color:"#334155"
 }}
/>

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