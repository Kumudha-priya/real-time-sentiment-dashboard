"use client";

import { useState, useEffect } from "react";
import DatasetTable from "../../components/DatasetTable";


type PreviewItem = {
  original: string;
  cleaned: string;
};


export default function DatasetPage() {


  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");

  const [preview, setPreview] = useState<PreviewItem[]>([]);

  const [dataset, setDataset] = useState<Record<string, unknown>[]>([]);

// ==============================
// FETCH DATASET
// ==============================
// ==============================
// FETCH DATASET
// ==============================


const loadDataset = async () => {

  try {

    const token = localStorage.getItem("token");


const res = await fetch(
  "http://127.0.0.1:8000/dataset",
  {
    headers:{
      "Authorization":
      `Bearer ${token}`
    }
  }
);


    const data = await res.json();


    console.log(
      "DATASET RESPONSE:",
      data
    );


    setDataset(
      Array.isArray(data)
      ? data
      : []
    );


  }
  catch(error){

    console.error(
      "Dataset fetch error:",
      error
    );

  }

};

// ==============================
  // UPLOAD DATASET
  // ==============================
useEffect(()=>{


  async function fetchDataset(){

    await loadDataset();

  }


  fetchDataset();


},[]);

  const uploadFile = async () => {


    if(!file){

      setMessage(
        "Please select CSV file"
      );

      return;

    }



    setUploading(true);

    setMessage("");



    const formData = new FormData();


    formData.append(
      "file",
      file
    );



    try{


      const res = await fetch(

        "http://127.0.0.1:8000/ingest",

        {

          method:"POST",

          body:formData

        }

      );




      if(!res.ok){


        const errorText =
          await res.text();


        throw new Error(
          errorText
        );


      }
      const data = await res.json();


console.log(
  "UPLOAD RESPONSE:",
  data
);


if(!data){

  throw new Error(
    "Backend returned empty response"
  );

}


setMessage(
  data.message ??
  "Upload successful"
);


      setPreview(

        Array.isArray(data.sample)
        ?
        data.sample
        :
        []

      );

      // refresh dataset table

      // refresh dataset table

await loadDataset();



    }


    catch(err){


      console.error(
        "UPLOAD ERROR:",
        err
      );


    setMessage(
 err instanceof Error
 ? err.message
 : "Upload failed"
);

    }


    finally{


      setUploading(false);


    }


  };




  return (


    <div
      className="
      p-8
      min-h-screen
      bg-gray-100
      dark:bg-black
      text-black
      dark:text-white
      "
    >



      <h1
        className="
        text-5xl
        font-bold
        mb-10
        "
      >

        Sentiment Analysis Dataset

      </h1>





      {/* UPLOAD SECTION */}

      <div className="mb-8">


        <input

          type="file"

          accept=".csv"

          onChange={
            (e)=>
            setFile(
              e.target.files?.[0] || null
            )
          }


          className="
          mb-4
          block
          "
        />




        <button


          onClick={uploadFile}


          disabled={uploading}


          className="
          px-6
          py-3
          bg-green-600
          text-white
          rounded-lg
          disabled:opacity-50
          "


        >

          {
            uploading
            ?
            "Uploading..."
            :
            "Upload CSV"
          }


        </button>




        {
          message &&

          <p
            className="
            mt-4
            text-blue-500
            font-bold
            "
          >

            {message}

          </p>

        }


      </div>






      {/* PREVIEW */}

      {

        preview.length > 0 &&


        <div
          className="
          mb-8
          "
        >


          <h2
            className="
            text-xl
            font-bold
            mb-3
            "
          >

            Uploaded Preview

          </h2>



          {

          preview.map(
            (item,index)=>(


              <div

                key={index}

                className="
                p-3
                border-b
                border-gray-700
                "

              >


                <p>

                  <b>
                    Original:
                  </b>

                  {" "}

                  {item.original}


                </p>




                <p>

                  <b>
                    Cleaned:
                  </b>

                  {" "}

                  {item.cleaned}


                </p>



              </div>


            )

          )

          }


        </div>


      }







      {/* TABLE */}

      <DatasetTable

        data={dataset}

      />




    </div>


  );

}