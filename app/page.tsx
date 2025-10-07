"use client";

import { useRouter } from "next/navigation";
import { useVaultStore } from "@/store/vaultStore";
import PasswordGenerator from "@/components/PasswordGenerator";
import VaultEntryForm from "@/components/VaultEntryForm";
import FeatureCards from "@/components/home/FeatureCards";
import Footer from "@/components/home/Footer";

export default function Home() {
  const router = useRouter();
  const { createVaultItem } = useVaultStore();

  // Handle saving vault item and redirect to dashboard
  const handleSaveVaultItem = async (data: {
    title: string;
    password: string;
    url?: string;
    notes?: string;
    tags?: string[];
  }) => {
    await createVaultItem(data);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Two-column layout: Generator + Entry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PasswordGenerator />
          <VaultEntryForm onSave={handleSaveVaultItem} />
        </div>

        <FeatureCards />
      </main>

      <Footer />
    </div>
  );
}
