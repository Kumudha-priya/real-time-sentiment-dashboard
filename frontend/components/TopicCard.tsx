type TopicItem = {
  topic?: string;
  keyword?: string;
  count: number;
};

type Props = {
  topics: TopicItem[];
};

export default function TopicCard({ topics }: Props) {
  return (
    <div className="p-4 bg-black text-white rounded-xl">
      <h2 className="text-lg font-bold mb-3">Top Topics</h2>

      {topics.map((t, i) => (
        <div key={i} className="flex justify-between py-1">
          <span>{t.topic ?? t.keyword}</span>
          <span>{t.count}</span>
        </div>
      ))}
    </div>
  );
}