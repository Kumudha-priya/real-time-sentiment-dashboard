type AnalyticsCardProps = {
  title: string;
  value: string | number;
  color: string;
  loading?: boolean;
};

export default function AnalyticsCard({
  title,
  value,
  color,
  loading = false,
}: AnalyticsCardProps) {
  if (loading) {
    return (
      <div className="p-6 rounded-3xl bg-slate-800 animate-pulse">
        <div className="h-4 bg-gray-600 w-1/2 mb-4 rounded"></div>
        <div className="h-8 bg-gray-600 w-1/3 rounded"></div>
      </div>
    );
  }

  return (
    <div
      className={`
        ${color}
        p-6
        rounded-3xl
        text-white
        shadow-lg
        hover:shadow-2xl
        hover:-translate-y-1
        transition-all
        duration-300
      `}
    >
      <h3 className="text-sm font-medium opacity-80">
        {title}
      </h3>

      <h2 className="text-4xl font-bold mt-3">
        {value}
      </h2>
    </div>
  );
}