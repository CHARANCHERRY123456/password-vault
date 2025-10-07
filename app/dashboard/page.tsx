"use client";

import { useEffect, useState } from 'react';
import { useVaultStore } from '@/store/vaultStore';
import VaultItem from '@/components/VaultItem';
import AddEditVaultModal from '@/components/AddEditVaultModal';

export default function DashboardPage() {
    const {
        filteredItems,
        vaultItems,
        searchQuery,
        selectedTag,
        isLoading,
        error,
        isModalOpen,
        editingItem,
        fetchVaultItems,
        createVaultItem,
        editVaultItem,
        removeVaultItem,
        setSearchQuery,
        setSelectedTag,
        openModal,
        closeModal,
    } = useVaultStore();

    const [allTags, setAllTags] = useState<string[]>([]);

    useEffect(() => {
        fetchVaultItems();
    }, [fetchVaultItems]);

    useEffect(() => {
        // Extract all unique tags from vault items
        const tags = new Set<string>();
        vaultItems.forEach((item) => {
            item.tags?.forEach((tag) => tags.add(tag));
        });
        setAllTags(Array.from(tags).sort());
    }, [vaultItems]);

    const handleDelete = async (id: string) => {
        await removeVaultItem(id);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Password Vault
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Securely store and manage your passwords
                            </p>
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add New Item
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filter Bar */}
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by title, URL, or notes..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Tag Filter */}
                        <div className="md:w-64">
                            <label htmlFor="tag-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Filter by Tag
                            </label>
                            <select
                                id="tag-filter"
                                value={selectedTag || ''}
                                onChange={(e) => setSelectedTag(e.target.value || null)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
                            >
                                <option value="">All Tags</option>
                                {allTags.map((tag) => (
                                    <option key={tag} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(searchQuery || selectedTag) && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                            {searchQuery && (
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-full flex items-center gap-1">
                                    Search: "{searchQuery}"
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="hover:text-blue-900 dark:hover:text-blue-100"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {selectedTag && (
                                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm rounded-full flex items-center gap-1">
                                    Tag: {selectedTag}
                                    <button
                                        onClick={() => setSelectedTag(null)}
                                        className="hover:text-purple-900 dark:hover:text-purple-100"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-red-800 dark:text-red-300">{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <svg className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}

                {/* Vault Items Grid */}
                {!isLoading && filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredItems.map((item) => (
                            <VaultItem
                                key={item._id}
                                item={item}
                                onEdit={openModal}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    !isLoading && (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                {searchQuery || selectedTag ? 'No matching items found' : 'No vault items yet'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {searchQuery || selectedTag
                                    ? 'Try adjusting your search or filters'
                                    : 'Get started by creating your first vault item'}
                            </p>
                            {!searchQuery && !selectedTag && (
                                <button
                                    onClick={() => openModal()}
                                    className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Create First Item
                                </button>
                            )}
                        </div>
                    )
                )}

                {/* Stats Footer */}
                {!isLoading && vaultItems.length > 0 && (
                    <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Showing {filteredItems.length} of {vaultItems.length} items
                        {allTags.length > 0 && ` • ${allTags.length} tags`}
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <AddEditVaultModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={createVaultItem}
                onUpdate={editVaultItem}
                editingItem={editingItem}
            />
        </div>
    );
}