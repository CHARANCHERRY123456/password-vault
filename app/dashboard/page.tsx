"use client";

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useVaultStore } from '@/store/vaultStore';
import VaultItem from '@/components/VaultItem';
import AddEditVaultModal from '@/components/AddEditVaultModal';
import SearchBar from '@/components/vault/SearchBar';
import TagFilter from '@/components/vault/TagFilter';
import EmptyState from '@/components/vault/EmptyState';

export default function DashboardPage() {
    const router = useRouter();
    const store = useVaultStore();
    const { filteredItems, vaultItems, searchQuery, selectedTag, isLoading } = store;

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        vaultItems.forEach((item) => item.tags?.forEach((tag) => tags.add(tag)));
        return Array.from(tags).sort();
    }, [vaultItems]);

    useEffect(() => {
        store.fetchVaultItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            🔐 Password Vault
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Securely manage your passwords
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        ➕ Add New
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Search & Filters */}
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700">
                    <div className="flex flex-col md:flex-row gap-4">
                        <SearchBar value={searchQuery} onChange={store.setSearchQuery} />
                        <TagFilter tags={allTags} selectedTag={selectedTag} onChange={store.setSelectedTag} />
                    </div>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
                    </div>
                )}

                {/* Vault Items */}
                {!isLoading && filteredItems.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredItems.map((item) => (
                            <VaultItem
                                key={item._id}
                                item={item}
                                onEdit={store.openModal}
                                onDelete={store.removeVaultItem}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredItems.length === 0 && (
                    <EmptyState
                        searchQuery={searchQuery}
                        selectedTag={selectedTag}
                    />
                )}

                {/* Stats */}
                {!isLoading && vaultItems.length > 0 && (
                    <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Showing {filteredItems.length} of {vaultItems.length} items
                    </div>
                )}
            </main>

            {/* Modal */}
            <AddEditVaultModal
                isOpen={store.isModalOpen}
                onClose={store.closeModal}
                onSave={store.createVaultItem}
                onUpdate={store.editVaultItem}
                editingItem={store.editingItem}
            />
        </div>
    );
}