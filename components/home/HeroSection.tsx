"use client";

import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          🔐 Password Vault
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Generate strong passwords and securely store them in one place
        </p>
        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            📂 View My Vault
          </button>
        </div>
      </div>
    </header>
  );
}
