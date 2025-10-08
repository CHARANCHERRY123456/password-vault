"use client";

import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { downloadJSON, readJSONFile } from "@/lib/exportImport";
import { useCrypto } from "@/contexts/CryptoContext";

interface ExportImportButtonsProps {
    vaultItems: any[];
    onImportSuccess: () => void;
}

export default function ExportImportButtons({ vaultItems, onImportSuccess }: ExportImportButtonsProps) {
    const { hasKey } = useCrypto();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [password, setPassword] = useState("");
    const [importData, setImportData] = useState<any>(null);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Export vault data
    const handleExport = () => {
        if (vaultItems.length === 0) {
            toast.info("No vault items to export");
            return;
        }

        // Download encrypted vault data
        const filename = `vault-backup-${new Date().toISOString().split('T')[0]}.json`;
        downloadJSON({ items: vaultItems, exportedAt: new Date().toISOString() }, filename);
        toast.success(`✅ Exported ${vaultItems.length} items`);
    };

    // Handle file selection
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const data = await readJSONFile(file);
            
            if (!data.items || !Array.isArray(data.items)) {
                toast.error("Invalid vault backup file");
                return;
            }

            setImportData(data);
            setShowPasswordModal(true);
        } catch (error) {
            toast.error("Failed to read file");
        }
    };

    // Confirm import with password
    const handleImportConfirm = async () => {
        if (!password.trim()) {
            toast.error("Please enter your password");
            return;
        }

        if (!importData) return;

        setIsImporting(true);

        try {
            // Import items one by one
            let successCount = 0;
            for (const item of importData.items) {
                try {
                    const res = await fetch("/api/vault", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({
                            title: item.title,
                            password: item.password, // Already encrypted
                            url: item.url,
                            notes: item.notes,
                            tags: item.tags,
                        }),
                    });

                    if (res.ok) successCount++;
                } catch (err) {
                    console.error("Failed to import item:", item.title);
                }
            }

            toast.success(`✅ Imported ${successCount} items`);
            setShowPasswordModal(false);
            setPassword("");
            setImportData(null);
            
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            // Refresh vault items
            onImportSuccess();
        } catch (error) {
            toast.error("Failed to import vault");
        } finally {
            setIsImporting(false);
        }
    };

    const handleImportCancel = () => {
        setShowPasswordModal(false);
        setPassword("");
        setImportData(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <>
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                {/* Export Button */}
                <button
                    onClick={handleExport}
                    disabled={!hasKey || vaultItems.length === 0}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    title="Export all vault items"
                >
                    📥 Export ({vaultItems.length})
                </button>

                {/* Import Button */}
                <label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileSelect}
                        disabled={!hasKey}
                        className="hidden"
                    />
                    <div className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm inline-block">
                        📤 Import Backup
                    </div>
                </label>
            </div>

            {/* Password Confirmation Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            🔐 Confirm Import
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Enter your password to confirm import of {importData?.items?.length || 0} items.
                        </p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleImportCancel}
                                disabled={isImporting}
                                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleImportConfirm}
                                disabled={isImporting || !password.trim()}
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isImporting ? "Importing..." : "Confirm Import"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
