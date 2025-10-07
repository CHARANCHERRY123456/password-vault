interface EmptyStateProps {
    searchQuery: string;
    selectedTag: string | null;
    onAddNew: () => void;
}

export default function EmptyState({ searchQuery, selectedTag, onAddNew }: EmptyStateProps) {
    const hasFilters = searchQuery || selectedTag;

    return (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {hasFilters ? 'No matching items' : 'No vault items yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                {hasFilters ? 'Try adjusting your filters' : 'Create your first vault item'}
            </p>
            {!hasFilters && (
                <button
                    onClick={onAddNew}
                    className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    ➕ Create First Item
                </button>
            )}
        </div>
    );
}
