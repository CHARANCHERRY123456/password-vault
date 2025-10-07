"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupForm() {
    const {setUser} = useAuth();
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [conformPassword , setConformPassword] = useState("");
    const [submitting , setSubmitting] = useState(false);
    const [error , setError] = useState<string | null>(null);
    const router = useRouter()
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        if (password !== conformPassword) {
            setError("Passwords do not match");
            setSubmitting(false);
            toast.error("Passwords do not match");
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                toast.success("Registered successfully");
                router.push("/");
                return;
            }

            const data = await res.json();
            const message = data.message || "Registration failed";
            setError(message);
            toast.error(message);
        } catch (err : any) {
            console.log(err.message + " is the error");
            setError("something went wrong");
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Sign Up</h2>
                
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="confirm-password" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Confirm Password
                    </label>
                    <input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={conformPassword}
                        onChange={(e) => setConformPassword(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded">
                        {error}
                    </div>
                )}

                <button 
                    disabled={submitting} 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {submitting ? "Signing up..." : "Sign Up"}
                </button>
            </form>

            <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                    Login
                </Link>
            </p>
        </div>
    );
}