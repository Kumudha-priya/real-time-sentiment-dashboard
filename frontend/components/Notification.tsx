"use client";

export default function Notification(
{
message
}:{
message:string
}
){

return(

<div
className="
fixed
top-5
right-5
bg-red-600
text-white
px-6
py-3
rounded-xl
shadow-xl
"
>

⚠ {message}

</div>

)

}