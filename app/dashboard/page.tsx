"use client"
import { toast } from "react-toastify";

export default function DashboardPage() {

    return (
        <div className="min-h-screen  flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
            <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">Welcome to Your Dashboard</h1>
            <p className="text-lg text-pink-700 dark:text-green-300">You are successfully logged in!</p>
            <button onClick={()=>{
                toast.success("Arey anna thank you ra naa website ki vachinandhuku")
            }} className="px-4 py-2 rounded bg-blue-600 text-white dark:bg-blue-500"> 
                Click please
            </button>
        </div>
    );
}