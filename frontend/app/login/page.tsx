"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {


    const router = useRouter();


    const [email,setEmail] = useState("");

    const [password,setPassword] = useState("");

    const [error,setError] = useState("");


async function handleLogin(){

    try{

        const formData = new URLSearchParams();

        formData.append(
            "grant_type",
            "password"
        );

        formData.append(
            "username",
            email
        );

        formData.append(
            "password",
            password
        );

        formData.append(
            "scope",
            ""
        );


        const response = await fetch(
            "http://127.0.0.1:8000/auth/login",
            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/x-www-form-urlencoded"
                },

                body:formData.toString()
            }
        );

        const data = await response.json();



        if(!response.ok){

            setError(
                data.detail || "Login failed"
            );

            return;

        }



        localStorage.setItem(
            "token",
            data.access_token
        );


        router.push("/dashboard");


    }

    catch(error){

        console.error(
            "Login error:",
            error
        );

        setError(
            "Backend connection failed"
        );

    }

}
    return (

        <div
        style={{
            width:"400px",
            margin:"100px auto",
            padding:"30px",
            border:"1px solid #ddd",
            borderRadius:"10px"
        }}
        >


            <h1>
                Login
            </h1>



            <input

            placeholder="Email"

            value={email}

            onChange={
                e=>setEmail(e.target.value)
            }

            style={{
                width:"100%",
                padding:"10px",
                margin:"10px 0"
            }}

            />




            <input

            placeholder="Password"

            type="password"

            value={password}

            onChange={
                e=>setPassword(e.target.value)
            }


            style={{
                width:"100%",
                padding:"10px",
                margin:"10px 0"
            }}

            />





            <button

            onClick={handleLogin}

            style={{
                width:"100%",
                padding:"10px",
                cursor:"pointer"
            }}

            >

                LOGIN

            </button>



            {
                error &&

                <p style={{
                    color:"red"
                }}>

                    {error}

                </p>

            }


        </div>

    );


}