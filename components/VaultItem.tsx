"use client";

import { useState } from 'react';
import { toast } from 'react-toastify';
import { VaultItem as VaultItemType } from '@/store/vaultStore';
import PasswordField from './vault/PasswordField';

interface VaultItemProps {
    item: VaultItemType;
    onEdit: (item: VaultItemType) => void;
    onDelete: (id: string) => void;
}

export default function VaultItem({ item, onEdit, onDelete }: VaultItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Delete this item?')) return;
        setIsDeleting(true);
        try {
            await onDelete(item._id);
            toast.success('Deleted successfully');
        } catch {
            toast.error('Failed to delete');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {item.title}
                    </h3>
                    {item.url && (
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            {item.url}
                        </a>
                    )}
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                        title="Edit"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md disabled:opacity-50"
                        title="Delete"
                    >
                        🗑️
                    </button>
                </div>
            </div>

            {/* Password */}
            <PasswordField password={item.password} />

            {/* Notes */}
            {item.notes && (
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Notes
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-300 dark:border-gray-600">
                        {item.notes}
                    </p>
                </div>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, idx) => (
                        <span
                            key={idx}
                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
