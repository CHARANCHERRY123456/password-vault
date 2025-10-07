interface TagFilterProps {
    tags: string[];
    selectedTag: string | null;
    onChange: (tag: string | null) => void;
}

export default function TagFilter({ tags, selectedTag, onChange }: TagFilterProps) {
    return (
        <div className="md:w-64">
            <label htmlFor="tag-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Tag
            </label>
            <select
                id="tag-filter"
                value={selectedTag || ''}
                onChange={(e) => onChange(e.target.value || null)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
                <option value="">All Tags</option>
                {tags.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                ))}
            </select>
        </div>
    );
}
