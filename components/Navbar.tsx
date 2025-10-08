"use client";

import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "./Logout";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show navbar on login/signup pages
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const isHomePage = pathname === '/';
  const isDashboard = pathname === '/dashboard';
  const isSettings = pathname === '/settings';

  return (
    <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <span className="text-2xl">🔐</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Password Vault
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                isHomePage
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              ➕ Create New
            </button>
            
            <button
              onClick={() => router.push('/dashboard')}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                isDashboard
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              📂 My Vault
            </button>

            <button
              onClick={() => router.push('/settings')}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                isSettings
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              ⚙️ Settings
            </button>

            <div className="border-l dark:border-gray-600 h-8 mx-2"></div>

            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
