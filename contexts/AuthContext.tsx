"use client";

import { User } from "@/type/User";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

type AuthContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
}


export default function AuthProvider(
    {children}:{children: React.ReactNode}
){
    const [user , setUser] = useState<User | null>(null);
    useEffect(()=>{
        async function fetchUser() {
            try {
                const res = await fetch("/api/auth/me", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
                
                if (!res.ok) {
                    setUser(null);
                    return;
                }
                
                const data = await res.json();
                if (data && data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
            }
        }
        
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() : AuthContextType{
    const context = useContext(AuthContext);
    if(!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}