"use client";

import { useEffect, useState } from "react";


interface Health {

    api:string;
    database:string;
    redis:string;
    celery:string;

}



export default function ErrorDashboard(){

const [health,setHealth] = useState<Health | null>(null);



useEffect(()=>{


async function loadHealth(){

const token = localStorage.getItem("token");

const response = await fetch(
 "http://127.0.0.1:8000/health",
 {
  headers:{
    Authorization:`Bearer ${token}`
  }
 }
);
const data =
await response.json();
setHealth(data);
}
loadHealth();
},[]);
if(!health){
return (
<div className="text-white">
Checking system status...

</div>

)

}



const services = [

{
name:"API",
status:health.api
},

{
name:"Database",
status:health.database
},

{
name:"Redis",
status:health.redis
},

{
name:"Celery",
status:health.celery
}

];



return (

<div className="
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-4
gap-6
">


{
services.map((service)=>(


<div
key={service.name}
className="
bg-slate-900
p-6
rounded-xl
shadow-lg
border
border-slate-700
"
>


<h2 className="
text-xl
font-bold
text-white
">

{service.name}

</h2>



<p className="mt-3">


{
service.status==="running"
||
service.status==="connected"

?

<span className="
text-green-400
">

🟢 {service.status}

</span>


:

<span className="
text-red-400
">

🔴 {service.status}

</span>

}


</p>


</div>


))

}


</div>


)


}