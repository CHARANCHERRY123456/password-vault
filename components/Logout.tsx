"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { clearKey } from "@/lib/crypto";

export default function LogoutButton() {
    const {user , setUser} = useAuth();
    const [loggingOut, setLoggingOut] = useState(false);
    
    if(!user) return null;
    return (
        <button 
            onClick={()=>{
                setLoggingOut(true);
                fetch("/api/auth/logout").then(()=>{
                    clearKey(); // Clear encryption key from localStorage
                    setUser(null);
                    window.location.href = "/login";
                })
                setLoggingOut(false);
            }}
            disabled={loggingOut}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
            {loggingOut ? "Logging out..." : "Logout"}
        </button>
    )
}