"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle(){

const {theme,setTheme}=useTheme();


return (

<select

value={theme}

onChange={(e)=>setTheme(e.target.value)}

className="
bg-gray-800
text-white
px-3
py-2
rounded-lg
border
border-gray-700
"

>

<option value="system">
System
</option>

<option value="dark">
Dark
</option>

<option value="light">
Light
</option>


</select>

);

}