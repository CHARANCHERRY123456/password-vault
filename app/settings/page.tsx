"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Enable2FA from "@/components/Enable2FA";
import ExportImport from "@/components/ExportImport";

interface User {
    id: string;
    email: string;
    name?: string;
    is2FAEnabled?: boolean;
}

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserSettings();
    }, []);

    const fetchUserSettings = async () => {
        try {
            const response = await fetch("/api/auth/me", {
                credentials: "include",
            });

            if (!response.ok) {
                router.push("/login");
                return;
            }

            const data = await response.json();
            setUser(data.user);
        } catch (error) {
            console.error("Failed to fetch user settings:", error);
            router.push("/login");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        ⚙️ Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your account security settings
                    </p>
                </div>

                {/* Account Info */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        👤 Account Information
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                            <p className="text-gray-900 dark:text-white font-medium">{user?.email}</p>
                        </div>
                        {user?.name && (
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Name:</span>
                                <p className="text-gray-900 dark:text-white font-medium">{user.name}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2FA Status */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        🔒 Security Status
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Two-Factor Authentication:</span>
                        {user?.is2FAEnabled ? (
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                                ✓ Enabled
                            </span>
                        ) : (
                            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium">
                                ⚠️ Not Enabled
                            </span>
                        )}
                    </div>
                </div>

                {/* Enable 2FA Component */}
                {!user?.is2FAEnabled && <Enable2FA />}

                {/* If 2FA is already enabled */}
                {user?.is2FAEnabled && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            ✅ 2FA is Active
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Your account is protected with two-factor authentication. You'll need your authenticator app to login.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            To disable 2FA, please contact support or implement a disable feature.
                        </p>
                    </div>
                )}

                {/* Export/Import Section */}
                <ExportImport />

                {/* Back Button */}
                <div className="mt-8">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </main>
        </div>
    );
}
