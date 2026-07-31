"use client";

import { useState, useEffect } from "react";

type AnalyzeResult = {
  original_text:string;
  cleaned_text:string;
  sentiment:string;
  confidence_score:number;
  topic:string;
  keywords:{
    keyword:string;
    score:number;
  }[];
};
export default function Live() {

  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState("");


  // CALL BACKEND
  const analyzeText = async () => {

    try {

      setLoading(true);

      const res = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",
          headers:{
 "Content-Type":"application/json",
 "Authorization":
 `Bearer ${localStorage.getItem("token")}`
},
          body: JSON.stringify({
            text
          }),
        }
      );


      const data = await res.json();

console.log("ANALYZE RESPONSE:",data);

if(data.task_id){
    setTaskId(data.task_id);
}
else{
    setResult(data);
    setLoading(false);
}


    } catch(error){

      console.error(error);

      setLoading(false);

    }

  };



  // POLLING FUNCTION
  const fetchResult = (id:string)=>{


    const poll = async()=>{


      try{


        const res = await fetch(
`http://127.0.0.1:8000/result/${id}`,
{
headers:{
Authorization:
`Bearer ${localStorage.getItem("token")}`
}
}
);

        const data = await res.json();



        if(data.status==="done"){

          setResult(data.data);

          setLoading(false);

        }


        else if(data.status==="failed"){

          alert(data.error);

          setLoading(false);

        }


        else{

          setTimeout(
            poll,
            2000
          );

        }



      }
      catch(error){

        console.error(error);

        setLoading(false);

      }


    };


    poll();

  };



  // START POLLING
  useEffect(()=>{

    if(taskId){

      fetchResult(taskId);

    }

  },[taskId]);




  return (

    <div className="p-6 min-h-screen bg-black">


      <h1 className="text-3xl font-bold mb-6 text-white">
        Live Analysis
      </h1>



      <textarea

        value={text}

        onChange={(e)=>setText(e.target.value)}

        className="
        w-full
        p-4
        rounded-lg
        border
        border-gray-700
        bg-slate-900
        text-white
        placeholder-gray-400
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        "

        rows={5}

        placeholder="Enter text..."

      />




      <button

        onClick={analyzeText}

        disabled={loading}

        className="
        px-6
        py-3
        bg-blue-600
        hover:bg-blue-700
        text-white
        rounded-lg
        mt-4
        disabled:opacity-50
        "

      >

        {
          loading
          ?
          "Analyzing..."
          :
          "Analyze"
        }


      </button>






      {result && (


        <div

          className="
          mt-8
          p-6
          bg-slate-900
          text-white
          rounded-xl
          shadow-lg
          border
          border-slate-700
          "

        >



          <p className="text-white mb-3">

            <b>Original Text:</b>{" "}

            {result.original_text}

          </p>





          <p className="text-white mb-3">

            <b>Cleaned Text:</b>{" "}

            {result.cleaned_text}

          </p>

          <p
className={`
mb-3
font-semibold
${
 result.sentiment?.toLowerCase() === "positive"
 ?
 "text-green-400"
 :
 result.sentiment?.toLowerCase() === "negative"
 ?
 "text-red-400"
 :
 "text-yellow-400"
}
`}
>

<b>Sentiment:</b>{" "}

{result.sentiment?.toLowerCase() || "unknown"}

</p>



         






          <p className="text-yellow-400 mb-3">

            <b>Confidence:</b>{" "}
           {Number(result.confidence_score ?? 0).toFixed(2)}%
          
          </p>





          <p className="text-blue-400 mb-4">

            <b>Topic:</b>{" "}

            {result.topic}

          </p>







          <p className="text-white font-semibold mb-3">

            Keywords:

          </p>





          <ul className="list-disc ml-6 space-y-2">

            {
             (result.keywords || []).map(
                (k,index)=>(

                <li
                key={index}
                className="text-gray-300"
                >

                  {k.keyword}

                  {" "}

                  <span className="text-blue-400">

                    {Number(k.score ?? 0).toFixed(2)}

                  </span>


                </li>


                )
              )
            }


          </ul>



        </div>


      )}



    </div>

  );


}