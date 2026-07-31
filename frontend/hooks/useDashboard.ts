"use client";

import { useEffect, useState } from "react";
import { fetchDashboard, fetchTrends } from "@/services/api";
import { AnalyticsResponse } from "@/lib/types";


type TrendItem = {
  date:string;
  count?:number;
  sentiment_count?:number;
  moving_avg_sentiment?:number;
};


export const useDashboard = (
  platform="",
  startDate="",
  endDate="",
  brand=""
)=>{


const [data,setData]=
useState<AnalyticsResponse|null>(null);


const [loading,setLoading]=
useState(true);


const [error,setError]=
useState<string|null>(null);


const [trendData,setTrendData]=
useState<TrendItem[]>([]);



useEffect(()=>{


async function loadDashboard(){


try{


setLoading(true);

setError(null);



const result =
await fetchDashboard(
platform,
startDate,
endDate,
brand
);



if(result){


setData(result);


const trendsResponse =
await fetchTrends(
    platform,
    startDate,
    endDate,
    brand
);


console.log(
"TREND RESPONSE:",
trendsResponse
);


setTrendData(
    trendsResponse
);


}
else{


setError(
"No dashboard data available"
);


setData(null);


}



}

catch(error){


if(
error instanceof DOMException &&
error.name==="AbortError"
){

return;

}


console.log(
"Dashboard loading error:",
error
);


setError(
"Failed to load dashboard"
);



}

finally{


setLoading(false);


}



}



loadDashboard();



},[
platform,
startDate,
endDate,
brand
]);



return{

data,

loading,

error,

trendData

};


};