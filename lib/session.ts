"use server"

import { cookies } from "next/headers";
const SESSION_NAME = "token";

export async function createSessionToken(token : string){
    (await cookies()).set(SESSION_NAME , token , {
        httpOnly : true,
    })
}

export async function deleteSessionToken() {
    (await cookies()).delete(SESSION_NAME);
}

export async function getSessiontoken() {
    return (await cookies()).get(SESSION_NAME)?.value;
}