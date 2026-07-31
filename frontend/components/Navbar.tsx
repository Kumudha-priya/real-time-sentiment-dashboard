"use client";
import ThemeToggle from "./ThemeToggle";


type NavbarProps = {
  platform: string;
  setPlatform: (value: string) => void;

  startDate: string;
  setStartDate: (value: string) => void;

  endDate: string;
  setEndDate: (value: string) => void;

  brand: string;
  setBrand: (value: string) => void;
};


export default function Navbar({

  platform,
  setPlatform,

  startDate,
  setStartDate,

  endDate,
  setEndDate,

  brand,
  setBrand,

}: NavbarProps) {
  return (

<div
className="
w-full
h-16
flex
items-center
justify-between
px-6
gap-4

bg-white
dark:bg-black

text-gray-900
dark:text-white

border-b
border-gray-200
dark:border-gray-800
"
>


{/* TITLE */}

<div
className="
text-xl
font-bold
whitespace-nowrap
"
>
Sentiment Dashboard
</div>



{/* FILTERS */}

<div
className="
flex
items-center
gap-3
"
>


{/* PLATFORM */}

<select

value={platform}

onChange={(e)=>setPlatform(e.target.value)}

className="
bg-gray-100
dark:bg-gray-800

text-gray-900
dark:text-white

px-3
py-2

rounded-lg

border
border-gray-300
dark:border-gray-700

"

>

<option value=""
className="text-black">
All Platforms
</option>


<option className="text-black"
value="twitter">
Twitter
</option>


<option className="text-black" value="reddit">
Reddit
</option>


</select>





{/* START DATE */}

<input

type="date"

value={startDate}

onChange={(e)=>setStartDate(e.target.value)}

className="
date-input

bg-gray-100
dark:bg-gray-900

text-gray-900
dark:text-white

px-3
py-2

rounded-lg

border
border-gray-300
dark:border-gray-700

"

/>





{/* END DATE */}

<input

type="date"

value={endDate}

onChange={(e)=>setEndDate(e.target.value)}

className="
date-input

bg-gray-100
dark:bg-gray-900

text-gray-900
dark:text-white

px-3
py-2

rounded-lg

border
border-gray-300
dark:border-gray-700

"

/>
{/* BRAND SEARCH */}

<input

type="text"

placeholder="Search brand"

value={brand}

onChange={(e)=>setBrand(e.target.value)}

className="

bg-gray-900
text-white

px-3
py-2

rounded-lg
border
border-gray-700

"

/>








{/* THEME */}

<ThemeToggle />



</div>



</div>

);


}