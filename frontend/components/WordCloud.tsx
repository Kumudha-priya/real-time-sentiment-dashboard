"use client";

import dynamic from "next/dynamic";

const WordCloud = dynamic(
  () => import("react-d3-cloud"),
  { ssr: false }
);

type Props = {
  data: {
    keyword: string;
    count: number;
  }[];
  theme?: "light" | "dark";
};

export default function WordCloudComponent({
  data,
}: Props) {

  const words = data.map((item) => ({
    text: item.keyword,
    value: item.count,
  }));

  return (
    <div className="w-full flex justify-center items-center">
      <WordCloud
        data={words}
        width={700}
        height={400}
        font="sans-serif"
        fontSize={(word: { value: number }) =>
          Math.log2(word.value) * 18
        }
        rotate={() => 0}
        padding={5}
      />
    </div>
  );
}