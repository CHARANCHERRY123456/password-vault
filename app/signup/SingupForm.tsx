"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupForm() {
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
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push("/");
                return;
            }

            const data = await res.json();
            setError(data.message || "Registration failed");
        } catch (err : any) {
            console.log(err.message + " is the error");
            setError("something went wrong");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <input
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input"
                />
            </div>

            <div className="flex flex-col gap-2">
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input"
                />
            </div>

            <div className="flex flex-col gap-2">
                <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    placeholder="Confirm Password"
                    value={conformPassword}
                    onChange={(e) => setConformPassword(e.target.value)}
                    required
                    className="input"
                />
            </div>

            {error && <div className="text-red-600">{error}</div>}

            <button disabled={submitting} type="submit" className="btn">
                {submitting ? "Signing up..." : "Sign Up"}
            </button>
        </form>
    );
}