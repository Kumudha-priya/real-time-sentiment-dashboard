"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Props = {
  positive: number;
  negative: number;
  neutral: number;
};

type PieLabelProps = {
  percent?: number;
  name?: string;
};

export default function SentimentPieChart({
  positive,
  negative,
  neutral,
}: Props) {
  const chartData = [
    { name: "Positive", value: positive },
    { name: "Negative", value: negative },
    { name: "Neutral", value: neutral },
  ];

  const COLORS = ["#22c55e", "#ef4444", "#64748b"];

  return (
    <div className="w-full h-[320px]">
     <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label={({ percent }: PieLabelProps) =>
              `${((percent ?? 0) * 100).toFixed(0)}%`
            }
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}