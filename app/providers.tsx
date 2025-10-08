"use client";

import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "@/contexts/AuthContext";
import { CryptoProvider } from "@/contexts/CryptoContext";

export default function Providers({children}:{children: React.ReactNode}){
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
                <CryptoProvider>
                    {children}
                    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="light"/>
                </CryptoProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}