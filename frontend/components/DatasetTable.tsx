"use client";

import { useState } from "react";

/* ---------------- TYPES ---------------- */

interface DataItem {

  id?: number;

  text?: string;

  sentiment?: string;

  manual_sentiment?: string;

  confidence_score?: number;

  topic_name?: string;

  confidence?: number;

  topic?: string;

}

type DatasetTableProps = {
  data: DataItem[] | unknown;
  title?: string;
  loading?: boolean;
};

/* ---------------- COMPONENT ---------------- */

export default function DatasetTable({
  data,
  title = "Dataset",
  loading = false,
}: DatasetTableProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
const rowsPerPage = 5;
async function updateSentiment(
  id:number,
  sentiment:string
){

 const token = localStorage.getItem("token");


 await fetch(
   `http://127.0.0.1:8000/override/${id}`,
   {
    method:"PUT",

    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${token}`
    },
  

      body:JSON.stringify({

        sentiment:sentiment

      })

    }
  );


  window.location.reload();

}

  // ---------------- STATES ----------------
  if (loading) {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-10 bg-gray-700 rounded"></div>
      ))}
    </div>
  );
}

  // ---------------- PRIORITY DATA FIX ----------------
const tableData: DataItem[] =
  Array.isArray(data)
    ? data
    : typeof data === "object" &&
      data !== null &&
      "data" in data &&
      Array.isArray((data as {data: DataItem[]}).data)
    ? (data as {data: DataItem[]}).data
    : [];

  // ---------------- LOADING UI ----------------

  // ---------------- EMPTY UI ----------------
  if (tableData.length === 0) {
    return <div className="text-white p-10">No data found.</div>;
  }

  // ---------------- FILTER ----------------
  const filteredData = tableData;
  // ---------------- PAGINATION ----------------
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = filteredData.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  // ---------------- COLORS ----------------
 const getBadgeColor = (sentiment: string) => {
  const s = sentiment?.toLowerCase();

  if (s === "positive") {
    return "bg-green-500/20 text-green-300 border border-green-500/40";
  }

  if (s === "negative") {
    return "bg-red-500/20 text-red-300 border border-red-500/40";
  }

  return "bg-gray-500/20 text-gray-300 border border-gray-500/40";
};

  const getTopicColor = (topic: string) => {
  if (!topic) {
    return "px-2 py-1 rounded-md bg-slate-700/40 text-slate-200";
  }

  if (topic.toLowerCase().includes("analytics")) {
    return "px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse";
  }

  return "px-2 py-1 rounded-md bg-slate-700/40 text-slate-200 border border-slate-500/30";
};

  // ---------------- UI ----------------
  return (
    <div className="bg-gradient-to-br from-slate-900 to-gray-950 border border-slate-800 p-6 rounded-3xl shadow-2xl animate-fadeIn">

      <h2 className="text-2xl font-bold text-white mb-6">
        {title}
      </h2>

      {/* TABLE */}
      <table className="w-full text-white border-separate border-spacing-y-2">
     <thead className="bg-slate-800/80">
    <tr className="text-gray-300">
      <th className="p-4 text-left rounded-l-xl w-[45%]">
        Post
      </th>

      <th className="p-4 text-center w-[20%]">
        Sentiment
      </th>

      <th className="p-4 text-center w-[15%]">
        Confidence
      </th>

      <th className="p-4 text-center">
    Override
</th>
      <th className="p-4 text-center rounded-r-xl w-[20%]">
        Topic
      </th>
    </tr>
  </thead>

  <tbody>
   {currentRows.map((item, index) => (
      <tr
  key={index}
  className="bg-slate-900/60 border border-slate-800 hover:bg-slate-800/50 transition-all duration-300"
>
        <td className="p-4 rounded-l-xl text-left">
          {item.text}
        </td>

        <td className="p-4 text-center">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold shadow-md transition-all duration-300 ${getBadgeColor(
  (
item.manual_sentiment ||
item.sentiment ||
"neutral"
).toLowerCase()
)} `}
          >
           {
(
item.manual_sentiment ||
item.sentiment ||
"neutral"
).toLowerCase()
}
          </span>
        </td>

        <td className="p-4 text-center font-semibold">
         {Number(
item.confidence_score ??
item.confidence ??
0
).toFixed(2)}%
        </td>
        <td className="p-4 text-center">


<select

className="
bg-slate-800
text-white
rounded
px-3
py-2
"


defaultValue=""

onChange={(e)=>{

 if(item.id){

 updateSentiment(
 item.id,
 e.target.value
 );

 }

}}

>


<option value="">
Select
</option>


<option value="positive">
Positive
</option>


<option value="negative">
Negative
</option>


<option value="neutral">
Neutral
</option>


</select>


</td>
        <td className="p-4 text-center rounded-r-xl">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold shadow-md transition-all duration-300 ${getTopicColor(
             item.topic_name ??
item.topic ??
""
            )}`}
          >
           {item.topic_name ?? item.topic}
          </span>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      {/* PAGINATION */}
      <div className="flex gap-4 justify-center mt-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-gray-700 rounded"
        >
          Prev
        </button>

        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-700 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}