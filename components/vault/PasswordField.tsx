import { useState } from 'react';
import { useCopyPassword } from '@/hooks/useCopyPassword';
import { useCrypto } from '@/contexts/CryptoContext';

interface PasswordFieldProps {
    password: string;
}

export default function PasswordField({ password }: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { copyPassword } = useCopyPassword();
    const { decryptText } = useCrypto();

    // Decrypt the password
    const decryptedPassword = decryptText(password);

    return (
        <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Password
            </label>
            <div className="flex gap-2">
                <div className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-md font-mono text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                    {showPassword ? decryptedPassword : '•'.repeat(decryptedPassword.length)}
                </div>
                <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    title={showPassword ? 'Hide' : 'Show'}
                >
                    {showPassword ? '🙈' : '👁️'}
                </button>
                <button
                    onClick={() => copyPassword(decryptedPassword)}
                    className="px-3 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors"
                    title="Copy"
                >
                    📋 Copy
                </button>
            </div>
        </div>
    );
}
