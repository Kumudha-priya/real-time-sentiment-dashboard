"use client";


export default function ExportButtons(){


function downloadCSV(){

window.open(
"http://127.0.0.1:8000/export/csv",
"_blank"
);

}



function downloadPDF(){

window.open(
"http://127.0.0.1:8000/export/pdf",
"_blank"
);

}



return(

<div className="flex gap-4">


<button

onClick={downloadCSV}

className="
bg-green-600
text-white
px-5
py-3
rounded-lg
"

>

Download CSV

</button>



<button

onClick={downloadPDF}

className="
bg-red-600
text-white
px-5
py-3
rounded-lg
"

>

Download PDF

</button>


</div>

)


}