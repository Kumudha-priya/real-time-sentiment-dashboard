"use client";

import DatasetTable from "../components/DatasetTable";
import LiveFeed from "../components/LiveFeed";
import { useDataset } from "../hooks/useDataset";


export default function Home() {


const { data: dataset } = useDataset();


return (

<div className="p-8 bg-black min-h-screen">


<h1 className="text-5xl font-bold text-white mb-10">
Real-Time Sentiment Analysis Dashboard
</h1>



{/* DATASET SECTION */}

<DatasetTable

data={dataset || []}

title="Recent Sentiment Posts"

/>



{/* LIVE FEED SECTION */}

<div className="mt-10">

<h2 className="text-3xl font-bold text-white mb-6">
Live Feed
</h2>


<LiveFeed/>


</div>



</div>

);


}