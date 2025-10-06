"use client"
import { useActionState, useState } from "react";
import { login } from "./action";
import { useFormStatus } from "react-dom";

export default function LoginForm(){
    const [state , loginAction] = useActionState(login , undefined);

    return <form action={loginAction} >
        <div className="flex flex-col gap-2">
            <input id="email" name="email" placeholder="Email" />
        </div>
        <div className="flex flex-col gap-2">
            <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            />
        </div>
        <SubmitButton />

    </form>
}

function SubmitButton(){
    const {pending} = useFormStatus();
    return <button disabled={pending} type="submit">
        Login
    </button>
}