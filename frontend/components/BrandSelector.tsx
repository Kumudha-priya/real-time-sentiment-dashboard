"use client";

type Props = {
  brand:string;
  onBrandChange:(value:string)=>void;
};


export default function BrandSelector({
  brand,
  onBrandChange
}:Props){


return(

<select

value={brand}

onChange={(e)=>
onBrandChange(e.target.value)
}

className="
w-40
p-3
rounded-lg

text-black
dark:text-white

bg-white
dark:bg-gray-800

border
border-gray-300
dark:border-gray-700

"

>

<option value="">
All Brands
</option>


<option value="nike">
Nike
</option>


<option value="apple">
Apple
</option>


<option value="samsung">
Samsung
</option>


</select>

)

}