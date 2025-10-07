"use client";

import { generatePassword } from "@/lib/passwordGenerator";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function PasswordGenerator() {
    const [length, setLength] = useState<number>(16);
    const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
    const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
    const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
    const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
    const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);
    const [generatedPassword, setGeneratedPassword] = useState<string>("");
    const [copied, setCopied] = useState<boolean>(false);

    function handleGeneratePassword() {
        const password = generatePassword({
            length,
            includeLowercase,
            includeUppercase,
            includeNumbers,
            includeSymbols,
            excludeAmbiguous
        });
        setGeneratedPassword(password);
    }

    // Auto-generate on mount
    useEffect(() => {
        handleGeneratePassword();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-clear after 60 seconds
    useEffect(() => {
        if (generatedPassword) {
            const timer = setTimeout(() => {
                setGeneratedPassword('');
                toast.info('🔒 Password cleared for security');
            }, 60000);
            return () => clearTimeout(timer);
        }
    }, [generatedPassword]);

    const copyToClipboard = async () => {
        if (!generatedPassword) return;
        
        try {
            await navigator.clipboard.writeText(generatedPassword);
            setCopied(true);
            toast.success("✅ Copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("❌ Failed to copy");
        }
    };

    const getPasswordStrength = () => {
        if (!generatedPassword) return { label: '', color: 'gray' };
        const len = generatedPassword.length;
        if (len < 8) return { label: 'Weak', color: 'red' };
        if (len < 12) return { label: 'Fair', color: 'yellow' };
        if (len < 16) return { label: 'Good', color: 'blue' };
        if (len < 20) return { label: 'Strong', color: 'green' };
        return { label: 'Very Strong', color: 'emerald' };
    };

    const strength = getPasswordStrength();
    const canGenerate = includeLowercase || includeUppercase || includeNumbers || includeSymbols;

    const ToggleSwitch = ({ 
        label, 
        checked, 
        onChange 
    }: { 
        label: string; 
        checked: boolean; 
        onChange: (checked: boolean) => void;
    }) => (
        <div className="flex items-center justify-between py-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <button
                onClick={() => onChange(!checked)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                    checked ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
            >
                <span 
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-md ${
                        checked ? 'translate-x-5' : ''
                    }`} 
                />
            </button>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    🔐 Password Generator
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create strong, secure passwords instantly
                </p>
            </div>

            {/* Password Display */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        value={generatedPassword}
                        readOnly
                        placeholder="Click generate to create password"
                        className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-lg tracking-wide text-gray-900 dark:text-white pr-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={copyToClipboard}
                        disabled={!generatedPassword}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {copied ? '✓ Copied' : '📋 Copy'}
                    </button>
                </div>
                
                {/* Strength Indicator */}
                {generatedPassword && (
                    <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                className={`h-full bg-${strength.color}-500 transition-all`}
                                style={{ width: `${(length / 32) * 100}%` }}
                            />
                        </div>
                        <span className={`text-sm font-medium text-${strength.color}-600 dark:text-${strength.color}-400`}>
                            {strength.label}
                        </span>
                    </div>
                )}
            </div>

            {/* Length Slider */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password Length
                    </label>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {length}
                    </span>
                </div>
                <input
                    type="range"
                    min="8"
                    max="32"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>8</span>
                    <span>32</span>
                </div>
            </div>

            {/* Options */}
            <div className="mb-6 space-y-1 border-t border-b dark:border-gray-700 py-4">
                <ToggleSwitch
                    label="Lowercase (a-z)"
                    checked={includeLowercase}
                    onChange={setIncludeLowercase}
                />
                <ToggleSwitch
                    label="Uppercase (A-Z)"
                    checked={includeUppercase}
                    onChange={setIncludeUppercase}
                />
                <ToggleSwitch
                    label="Numbers (0-9)"
                    checked={includeNumbers}
                    onChange={setIncludeNumbers}
                />
                <ToggleSwitch
                    label="Symbols (!@#$%)"
                    checked={includeSymbols}
                    onChange={setIncludeSymbols}
                />
                <ToggleSwitch
                    label="Exclude Ambiguous"
                    checked={excludeAmbiguous}
                    onChange={setExcludeAmbiguous}
                />
            </div>

            {/* Generate Button */}
            <button
                onClick={handleGeneratePassword}
                disabled={!canGenerate}
                className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                <span>🔄</span>
                <span>Generate New Password</span>
            </button>

            {!canGenerate && (
                <p className="mt-3 text-center text-sm text-red-600 dark:text-red-400">
                    ⚠️ Select at least one character type
                </p>
            )}
        </div>
    );
}