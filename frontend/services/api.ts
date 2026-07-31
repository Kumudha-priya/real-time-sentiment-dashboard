import axios from "axios";

import { API_BASE } from "@/lib/constants";
import { getToken } from "@/lib/auth";


const api = axios.create({

  baseURL: API_BASE,

  headers:{
    "Content-Type":"application/json",
  },

});


api.interceptors.request.use((config)=>{


  const token = getToken();


  if(token){

    config.headers.Authorization =
    `Bearer ${token}`;

  }


  return config;


});


// PIPELINE
export const runPipeline = async () => {

  const res = await api.post("/run-pipeline");

  return res.data;

};


// ANALYTICS
export const fetchAnalytics = async () => {

  const res = await api.get("/analytics");

  return res.data;

};
type TrendItem = {
  date:string;
  count?:number;
  sentiment_count?:number;
  moving_avg_sentiment?:number;
};

// TREND
export const fetchTrends = async (
  platform = "",
  startDate = "",
  endDate = "",
  brand = ""
): Promise<TrendItem[]>=> {

  const url = new URL(
 `${API_BASE}/analytics/trends`
);


  if(platform){
    url.searchParams.append(
      "platform",
      platform
    );
  }


  if(startDate){
    url.searchParams.append(
      "start_date",
      startDate
    );
  }


  if(endDate){
    url.searchParams.append(
      "end_date",
      endDate
    );
  }


  if(brand){
    url.searchParams.append(
      "brand",
      brand
    );
  }


  const token = getToken();


  const response = await fetch(
    url.toString(),
    {
      headers:{
        Authorization:
        `Bearer ${token}`
      }
    }
  );


  if(!response.ok){

    console.log(
      "Trend API Error:",
      await response.text()
    );

    return [];

  }


  const data = await response.json();


console.log(
  "TREND API RESPONSE:",
  data
);


if(Array.isArray(data)){

    return data;

}


return [];

};


// TOPICS
export const fetchTopics = async () => {

  const res = await api.get("/analytics/topics");

  return res.data;

};


// KEYWORDS
export const fetchKeywords = async () => {

  const res = await api.get("/analytics/keywords");

  return res.data;

};



// ==============================
// DASHBOARD
// ==============================

export async function fetchDashboard(

  platform = "",

  startDate = "",

  endDate = "",

  brand = ""

){


  const url = new URL(
    `${API_BASE}/dashboard`
  );


  if(platform){

    url.searchParams.append(
      "platform",
      platform
    );

  }


  if(startDate){

    url.searchParams.append(
      "start_date",
      startDate
    );

  }


  if(endDate){

    url.searchParams.append(
      "end_date",
      endDate
    );

  }


  if(brand){

    url.searchParams.append(
      "brand",
      brand
    );

  }



  const token = getToken();



  const response = await fetch(

    url.toString(),

    {

      headers:{

        "Content-Type":"application/json",

        Authorization:
        `Bearer ${token}`

      }

    }

  );



  if(!response.ok){

    console.log(
      "Dashboard API Error:",
      await response.text()
    );


    return null;

  }



  return response.json();


}




// ANALYZE
export const fetchAnalyze = async(text:string)=>{

const res = await api.post(
"/analyze",
{
text
}
);

return res.data;

};



// SENTIMENTS
export const fetchSentiments = async () => {

  const res = await api.get("/sentiments");

  return res.data;

};



// INGEST
export const fetchIngest = async () => {

  const res = await api.get("/ingest");

  return res.data;

};




// ==============================
// DATASET
// ==============================

export const fetchDataset = async()=>{

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE}/dataset`,
    {
      method:"GET",
      headers:{
        "Accept":"application/json",
        "Authorization":`Bearer ${token}`
      }
    }
  );


  if(!response.ok){

    console.log(
      "Dataset API Error:",
      await response.text()
    );

    return [];

  }


  return response.json();

};
// ==============================
// LIVE FEED
// ==============================

export const fetchLiveFeed = async()=>{

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE}/live?limit=20`,
    {
      method:"GET",
      headers:{
        "Accept":"application/json",
        "Authorization":`Bearer ${token}`
      }
    }
  );


  if(!response.ok){

    console.log(
      "Live Feed API Error:",
      await response.text()
    );

    return [];

  }


  return response.json();

};
