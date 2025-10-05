"use client"
import { hashPassowrd } from "@/lib/crypto";
import { createContext, useState } from "react";

interface User{
    id : string , email : string
}

interface AuthContextType {
    user : User | null,
    isLoading : boolean,
    signUp : (email : string , passowrd : string) => Promise<void>,
    signIn : (email : string , passowrd : string) => Promise<void>,
    signOut : () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}:{children: React.ReactNode}){
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [token , setToken] = useState<string | null>(null);

    const signUp = async (email : string , passowrd : string) => {
        setIsLoading(true);
        const hashedPassword = await hashPassowrd(passowrd);
        
        
    }


}