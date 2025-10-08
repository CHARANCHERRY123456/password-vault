"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useCrypto } from "@/contexts/CryptoContext";
import { deriveKey, storeKey } from "@/lib/crypto";

export default function LoginForm() {
    const { setUser } = useAuth();
    const { reloadKey } = useCrypto();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [requires2FA, setRequires2FA] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState("");
    
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ 
                    email, 
                    password,
                    ...(twoFactorCode && { twoFactorCode })
                }),
            });
            
            if (res.ok) {
                const data = await res.json();
                
                // Check if 2FA is required
                if (data.requires2FA) {
                    setRequires2FA(true);
                    toast.info("📱 Enter your 2FA code from authenticator app");
                    setSubmitting(false);
                    return;
                }

                // Login successful - derive and store encryption key
                const encryptionKey = deriveKey(password);
                storeKey(encryptionKey);
                reloadKey(); // Reload the key in context
                
                setUser(data.user);
                toast.success("✅ Logged in successfully");
                router.push("/");
                return;
            }

            const data = await res.json().catch(() => ({ message: "Login failed" }));
            const message = data.message || "Invalid credentials";
            setError(message);
            toast.error(message);
        } catch (err) {
            setError("Network error");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Login</h2>
                
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

                <div className="mb-6">
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
                        disabled={requires2FA}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                </div>

                {/* 2FA Code Input */}
                {requires2FA && (
                    <div className="mb-6">
                        <label htmlFor="twoFactorCode" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                            🔐 Two-Factor Authentication Code
                        </label>
                        <input
                            id="twoFactorCode"
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            value={twoFactorCode}
                            onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                            required
                            autoFocus
                            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                            Enter the 6-digit code from your authenticator app
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded">
                        {error}
                    </div>
                )}

                <button 
                    disabled={submitting || (requires2FA && twoFactorCode.length !== 6)} 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {submitting ? "Logging in..." : requires2FA ? "Verify & Login" : "Login"}
                </button>

                {requires2FA && (
                    <button
                        type="button"
                        onClick={() => {
                            setRequires2FA(false);
                            setTwoFactorCode("");
                            setError(null);
                        }}
                        className="w-full mt-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
                    >
                        ← Back to login
                    </button>
                )}
            </form>

            <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                    Sign up
                </Link>
            </p>
        </div>
    );
}