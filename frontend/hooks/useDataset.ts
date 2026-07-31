"use client";

import { useEffect, useState } from "react";
import { fetchDataset } from "@/services/api";


interface DatasetItem {

  id:number;

  text:string;

  sentiment:string;

  manual_sentiment:string | null;

  confidence_score:number;

  topic_name:string;

}



export const useDataset = () => {


  const [data,setData] =
  useState<DatasetItem[]>([]);



  const [loading,setLoading] =
  useState(true);



  const [error,setError] =
  useState<string | null>(null);



  useEffect(()=>{


    async function loadDataset(){


      try{


        setLoading(true);



        const result =
        await fetchDataset();

        console.log("DATASET API RESPONSE:", result);

        setData(result);



      }


      catch(error){


        console.log(
          "Dataset loading error:",
          error
        );


        setError(
          "Failed to load dataset"
        );


      }


      finally{


        setLoading(false);


      }


    }



    loadDataset();



  },[]);



  return {

    data,

    loading,

    error

  };


};