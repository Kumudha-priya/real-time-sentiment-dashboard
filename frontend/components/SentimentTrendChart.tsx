"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";


type TrendData = {
  date:string;
  count:number;
};


type Props = {
  data:TrendData[];
};


export default function SentimentTrendChart({
  data
}:Props){


return(

<div className="w-full h-[350px]">


{
data.length === 0 ? (

<p className="text-gray-400 flex justify-center items-center h-full">
No trend data available
</p>


)
:

(

<ResponsiveContainer
width="100%"
height={350}
>


<LineChart
data={data}
margin={{
top:20,
right:30,
left:10,
bottom:20
}}
>


<CartesianGrid
strokeDasharray="3 3"
stroke="#374151"
/>


<XAxis

dataKey="date"
tickFormatter={(value)=>value.slice(5)}
interval="preserveStartEnd"
tick={{
fill:"#9ca3af",
fontSize:12
}}

/>


<YAxis

tick={{
fill:"#9ca3af"
}}

/>


<Tooltip

contentStyle={{
backgroundColor:"#111827",
border:"1px solid #374151",
borderRadius:"10px",
color:"#fff"
}}

/>



<Line

type="monotone"

dataKey="count"

stroke="#3b82f6"

strokeWidth={3}

dot={{
r:4,
fill:"#3b82f6"
}}

activeDot={{
r:7
}}

/>



</LineChart>


</ResponsiveContainer>

)

}


</div>


)

}