"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function Enable2FA() {
    const [loading, setLoading] = useState(false);
    const [qrCode, setQrCode] = useState<string>("");
    const [secret, setSecret] = useState<string>("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    // Step 1: Generate QR code
    const handleEnable2FA = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/auth/2fa/enable", {
                method: "POST",
            });

            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message || "Failed to generate QR code");
                return;
            }

            const data = await response.json();
            setQrCode(data.qrCode);
            setSecret(data.secret);
            toast.success("📱 Scan the QR code with your authenticator app");
        } catch (error) {
            toast.error("Failed to enable 2FA");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify code and enable 2FA
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (verificationCode.length !== 6) {
            toast.error("Please enter a 6-digit code");
            return;
        }

        setIsVerifying(true);
        try {
            const response = await fetch("/api/auth/2fa/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: verificationCode }),
            });

            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message || "Invalid code");
                return;
            }

            const data = await response.json();
            if (data.success) {
                toast.success("🎉 2FA enabled successfully!");
                // Reset state
                setQrCode("");
                setSecret("");
                setVerificationCode("");
                // Reload page to update status
                window.location.reload();
            }
        } catch (error) {
            toast.error("Failed to verify code");
        } finally {
            setIsVerifying(false);
        }
    };

    // If QR code is shown, display verification form
    if (qrCode) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    📱 Scan QR Code
                </h3>
                
                {/* QR Code */}
                <div className="flex justify-center mb-6">
                    <img 
                        src={qrCode} 
                        alt="2FA QR Code" 
                        className="border-4 border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                </div>

                {/* Manual Entry */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Or enter this code manually:
                    </p>
                    <code className="block text-center text-lg font-mono text-gray-900 dark:text-white break-all">
                        {secret}
                    </code>
                </div>

                {/* Verification Form */}
                <form onSubmit={handleVerify}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Enter 6-digit code from your app
                        </label>
                        <input
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={isVerifying || verificationCode.length !== 6}
                            className="flex-1 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {isVerifying ? "Verifying..." : "✓ Enable 2FA"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setQrCode("");
                                setSecret("");
                                setVerificationCode("");
                            }}
                            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                {/* Instructions */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>📱 How to setup:</strong>
                    </p>
                    <ol className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1 list-decimal list-inside">
                        <li>Install Google Authenticator or similar app</li>
                        <li>Scan the QR code with your app</li>
                        <li>Enter the 6-digit code shown in the app</li>
                        <li>Keep the app safe - you'll need it to login</li>
                    </ol>
                </div>
            </div>
        );
    }

    // Initial state - Show enable button
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        🔐 Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Add an extra layer of security to your account. You'll need to enter a code from your authenticator app when logging in.
                    </p>
                </div>
            </div>

            <button
                onClick={handleEnable2FA}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                {loading ? "Loading..." : "🔒 Enable 2FA"}
            </button>
        </div>
    );
}
