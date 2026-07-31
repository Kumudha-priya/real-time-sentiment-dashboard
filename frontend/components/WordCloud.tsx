"use client";

import dynamic from "next/dynamic";

const WordCloud = dynamic(() => import("react-d3-cloud"), { ssr: false });

type Props = {
  data: {
    keyword: string;
    count: number;
  }[];
};

export default function WordCloudComponent({ data }: Props) {
  if (!data.length) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400">
        No keywords available
      </div>
    );
  }

  const words = data.map((item) => ({
    text: item.keyword,
    value: item.count,
  }));

  return (
    <div className="w-full h-[300px] flex justify-center items-center">
      <WordCloud
        data={words}
        width={500}
        height={300}
        font="sans-serif"
        fontSize={(word: { value: number }) =>
          Math.max(14, Math.log2(word.value + 1) * 12)
        }
        rotate={0}
        padding={5}
        fill={() =>
          ["#38bdf8", "#34d399", "#facc15", "#fb7185"][
            Math.floor(Math.random() * 4)
          ]
        }
      />
    </div>
  );
}