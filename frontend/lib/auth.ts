export function getToken(){

if(typeof window === "undefined"){
return "";
}

return localStorage.getItem("token") || "";

}