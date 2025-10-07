"use client";

import { useState } from "react";

export default function LogoutButton() {
    return (
        <button onClick={()=>{
            fetch("/api/auth/logout").then(()=>{
                window.location.href = "/login"
            })
        }}>
            Logout
        </button>
    )
}