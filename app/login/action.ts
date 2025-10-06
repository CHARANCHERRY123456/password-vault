"use server"

import { createSessionToken, getSessiontoken } from "@/lib/session";
import { redirect } from "next/navigation";

export async function login(prevState : any , formData : FormData) {
    const {email , password} = Object.fromEntries(formData);    
    console.log(email , password , "is trying to login");

    createSessionToken("this is my handmade token");
    console.log(getSessiontoken());
    
    redirect("/");
    
}