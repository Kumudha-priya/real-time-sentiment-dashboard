"use client";

import { useEffect, useRef } from "react";


type WebSocketMessage = {
  type: string;
  message?: string;
};


export function useWebSocket(
  callback: (data: WebSocketMessage) => void
) {


  const callbackRef = useRef(callback);



  useEffect(()=>{

    callbackRef.current = callback;

  },[callback]);




  useEffect(()=>{


    const ws = new WebSocket(
      "ws://localhost:8000/ws"
    );



    ws.onopen = ()=>{

      console.log(
        "WebSocket connected"
      );

    };




    ws.onmessage = (event)=>{


      try{


        const data: WebSocketMessage =
          JSON.parse(event.data);



        callbackRef.current(data);



      }

      catch(error){


        console.log(
          "Invalid WebSocket message:",
          error
        );


      }


    };




    ws.onerror = (error)=>{


      console.log(
        "WebSocket error:",
        error
      );


    };




    ws.onclose = ()=>{


      console.log(
        "WebSocket disconnected"
      );


    };




    return()=>{


      ws.close();


    };


  },[]);


}