"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: { topic?: string; count?: number }[];
};

export default function TopicChart({ data }: Props) {
  const sorted = [...data]
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
    .slice(0, 10);

  if (!sorted.length) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400">
        No topics available
      </div>
    );
  }

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={sorted}>
  <XAxis
  dataKey="topic"
  stroke="#111827"
  angle={-35}
  textAnchor="end"
  height={120}
  interval={0}
  tickFormatter={(value) =>
    value.length > 15
      ? value.slice(0, 15) + "..."
      : value
  }
/>

  <YAxis  stroke="#111827" />

  <Tooltip
 contentStyle={{
   backgroundColor:"#ffffff",
   color:"#111827",
   borderRadius:"12px",
   border:"1px solid #e5e7eb"
 }}
/>

  <Bar
    dataKey="count"
    fill="#38bdf8"
  />
</BarChart>
      </ResponsiveContainer>
    </div>
  );
}