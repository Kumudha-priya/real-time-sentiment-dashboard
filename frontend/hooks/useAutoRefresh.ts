import { useEffect } from "react";


export function useAutoRefresh(
  callback: () => void,
  intervalTime = 30000
) {


  useEffect(()=>{


    const interval = setInterval(()=>{

      callback();

    }, intervalTime);



    return ()=>{

      clearInterval(interval);

    };


  },[callback, intervalTime]);


}