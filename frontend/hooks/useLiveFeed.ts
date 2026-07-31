"use client";

import {useEffect,useState} from "react";
import {fetchLiveFeed} from "@/services/api";


interface LivePost{

id:number;

text:string;

sentiment:string;

confidence_score:number;

topic_name:string;

created_at:string;

keywords:string[];

}


interface ApiLivePost {

id:number;

text:string;

sentiment:string;

confidence_score:number;

topic_name:string;

created_at:string;

keywords:string[];

}



export default function useLiveFeed(){


const [posts,setPosts]=useState<LivePost[]>([]);



useEffect(()=>{


async function load(){


try{


const data:ApiLivePost[] = await fetchLiveFeed();



const formatted:LivePost[] =
data.map((item)=>({


id:item.id,

text:item.text,

sentiment:item.sentiment,

confidence_score:item.confidence_score,

topic_name:item.topic_name,

created_at:item.created_at,

keywords:item.keywords ?? []


}));


console.log(
"FORMATTED LIVE DATA:",
formatted
);


setPosts(formatted);



}
catch(error){

console.log(error);

}


}



load();


},[]);



return posts;


}