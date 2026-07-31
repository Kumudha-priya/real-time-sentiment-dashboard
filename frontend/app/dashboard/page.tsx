"use client";

import { useDashboard } from "@/hooks/useDashboard";
import AnalyticsCard from "@/components/AnalyticsCard";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import SentimentPieChart from "@/components/SentimentPieChart";
import SentimentTrendChart from "@/components/SentimentTrendChart";
import LiveFeed from "@/components/LiveFeed";
import TopicChart from "@/components/TopicChart";
import {useWebSocket} from "@/hooks/useWebSocket";
import Notification from "@/components/Notification";
import BrandSelector from "@/components/BrandSelector";
/* TYPES */

type RawKeyword = {
  keyword?: string;
  count?: number;
};


type TopicItem = {
  topic?: string;
  count?: number;
};


type TrendItem = {
  date: string;
  count?: number;
  sentiment_count?: number;
  moving_avg_sentiment?: number;
};


type RawTopic = {
  topic?: string;
  count?: number;
};

export default function Dashboard() {
  const [platform,setPlatform] = useState("");
  const [startDate,setStartDate] = useState("");
  const [endDate,setEndDate] = useState("");
 const [brand,setBrand] = useState("");
 const [alert,setAlert]=useState("");

const {
    data,
    loading,
    error,
    trendData
} = useDashboard(
  platform,
  startDate,
  endDate,
  brand
);



  // ============================
  // WEBSOCKET LIVE UPDATE
  // ============================

  useWebSocket(
    (data)=>{

      if(data.type === "update"){

        window.location.reload();

      }

      if(data.type === "alert"){

  if(data.message){

    setAlert(data.message);

    setTimeout(()=>{
      setAlert("");
    },5000);

  }

}

    }
  );
// ============================
// AUTO REFRESH EVERY 30 SEC
// ============================

if(error){

    return(
      <div className="
      min-h-screen
      flex
      items-center
      justify-center
      text-red-400
      ">
        {error}
      </div>
    )

  }

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white text-xl">
      Loading dashboard data...
    </div>
  );
}


if (!data) {
  return (
    <div className="min-h-screen flex items-center justify-center text-red-400 text-xl">
      Unable to load dashboard data.
      <br />
      Please check API connection.
    </div>
  );
}
  
  /* SENTIMENT TOTAL */


  const totals = {

    Positive:data.positive ?? 0,

    Negative:data.negative ?? 0,

    Neutral:data.neutral ?? 0

  };



  const total =
  totals.Positive +
  totals.Negative +
  totals.Neutral;



  const avgConfidence =
  total > 0
  ?
  (
    (totals.Positive + totals.Negative)
    /
    total
  ) * 100
  :
  0;
/* TREND DATA */


const trendChartData =
Array.isArray(trendData)
?
trendData.map((item:TrendItem)=>({

date:item.date,

count:
item.count ??
item.sentiment_count ??
item.moving_avg_sentiment ??
0

}))
:
[];
  /* TOP TOPICS */


  const cleanTopics:TopicItem[] =

  (data.top_topics ?? [])

  .filter((t:RawTopic)=>{


    const topic =
    t.topic?.toLowerCase() || "";


    return(

      topic.length > 3 &&

      !topic.includes("http") &&

      !/^\d+$/.test(topic)

    )

  })

  .slice(0,10);







  /* TOP KEYWORDS */


  const cleanKeywords =

  (data.top_keywords ?? [])

  .filter((k:RawKeyword)=>
    k.keyword
  )

  .map((k:RawKeyword)=>({

    keyword:String(k.keyword),

    count:Number(k.count ?? 0)

  }))

  .slice(0,40);

return(

<div
className="
min-h-screen
flex
bg-gray-100
dark:bg-gradient-to-br
dark:from-gray-950
dark:via-black
dark:to-gray-900
text-gray-900
dark:text-white
"
>
 {
alert &&
<Notification
message={alert}
/>
} 
  {
loading && (

<div
className="
fixed
top-16
right-6
bg-blue-600
text-white
px-4
py-2
rounded-lg
shadow-lg
z-50
"
>
Updating dashboard...
</div>

)
}



{/* SIDEBAR */}


<div className="
hidden
lg:block
w-64
bg-black/40
p-6
">

<h2 className="
text-3xl
font-bold
">

AI Monitor

</h2>


</div>






{/* MAIN */}


<div className="
flex-1
">




<Navbar

platform={platform}
setPlatform={setPlatform}

startDate={startDate}
setStartDate={setStartDate}

endDate={endDate}
setEndDate={setEndDate}

brand={brand}
setBrand={setBrand}

/>

<BrandSelector

brand={brand}

onBrandChange={(value)=>{

setBrand(value);

}}

/>
<div className="
p-8
space-y-8
">
{/* HEADER */}
<div>
<h1 className="
text-4xl
font-bold
">
Real-Time Sentiment Dashboard
</h1>
<p className="
text-gray-400
mt-2
">

Monitor social media sentiment,
topics, trends and brand activity.

</p>
{/*<ErrorDashboard />*/}
{/*<ExportButtons />*/}
</div>
{/* CARDS */}
<div className="
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-4
gap-6
">
<AnalyticsCard

title="Positive"

value={totals.Positive}

color="bg-green-600"

/>
<AnalyticsCard

title="Negative"

value={totals.Negative}

color="bg-red-600"

/>
<AnalyticsCard

title="Neutral"

value={totals.Neutral}

color="bg-gray-600"

/>
<AnalyticsCard

title="Avg Confidence"

value={`${avgConfidence.toFixed(2)}%`}

color="bg-blue-600"

/>

</div>
{/* PIE + TREND */}

<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-6
">

<div className="
bg-white
dark:bg-slate-900
rounded-2xl
p-6
shadow-lg
">

<h2 className="
text-xl
font-bold
mb-4
">

Sentiment Distribution

</h2>


<SentimentPieChart

positive={totals.Positive}

negative={totals.Negative}

neutral={totals.Neutral}

/>


</div>

<div className="
bg-white
dark:bg-slate-900
rounded-2xl
p-6
shadow-lg
">

<h2 className="
text-xl
font-bold
mb-4
">

Sentiment Activity Trend

</h2>



<SentimentTrendChart

data={trendChartData}

/>



</div>



</div>

{/* TOPICS + KEYWORDS */}


<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-6
">

{/* TOP TOPICS */}
<div className="
bg-white dark:bg-white/5
rounded-2xl
p-6
border
border-gray-200 dark:border-white/10
">
<h2 className="
text-xl
font-bold
mb-6
">
Top Discussion Topics
</h2>
<div className="h-[350px]">
<TopicChart
data={cleanTopics}
/>
</div>
</div>
{/* TOP KEYWORDS */}
<div className="
bg-white dark:bg-white/5
rounded-2xl
p-6
border
border-gray-200 dark:border-white/10
">
<h2 className="
text-xl
font-bold
mb-6
">
Trending Keywords
</h2>
<div className="
flex
flex-wrap
gap-3
">
{
cleanKeywords.length === 0 ?
<p className="text-gray-600 mt-2">
No keywords available
</p>
:
cleanKeywords.map((item,index)=>(
<span
key={index}
className="
px-4
py-2
rounded-full
bg-blue-600
text-white
font-semibold
shadow-md
hover:bg-blue-700
transition-all
duration-300
hover:scale-105
"
>
#{item.keyword}
</span>
))
}
</div>
</div>
</div>
{/* LIVE FEED */}
<div className="
bg-white
dark:bg-slate-900
rounded-2xl
p-6
shadow-lg
">
<h2 className="
text-xl
font-bold
mb-4
">
Live Sentiment Feed
</h2>
<div
className="
h-[450px]
overflow-y-auto
scrollbar-thin
scrollbar-thumb-gray-600
"
>
<LiveFeed/>
</div>
</div>
</div>
</div>
</div>
)
}