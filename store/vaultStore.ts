import { create } from 'zustand';

export interface VaultItem {
    _id: string;
    userId: string;
    title: string;
    password: string;
    url?: string;
    notes?: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
}

interface VaultStore {
    vaultItems: VaultItem[];
    filteredItems: VaultItem[];
    searchQuery: string;
    selectedTag: string | null;
    isLoading: boolean;
    error: string | null;
    isModalOpen: boolean;
    editingItem: VaultItem | null;
    
    // Actions
    setVaultItems: (items: VaultItem[]) => void;
    addVaultItem: (item: VaultItem) => void;
    updateVaultItem: (id: string, item: Partial<VaultItem>) => void;
    deleteVaultItem: (id: string) => void;
    setSearchQuery: (query: string) => void;
    setSelectedTag: (tag: string | null) => void;
    filterItems: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    openModal: (item?: VaultItem) => void;
    closeModal: () => void;
    
    // API calls
    fetchVaultItems: () => Promise<void>;
    createVaultItem: (data: Omit<VaultItem, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    editVaultItem: (id: string, data: Partial<VaultItem>) => Promise<void>;
    removeVaultItem: (id: string) => Promise<void>;
}

export const useVaultStore = create<VaultStore>((set, get) => ({
    vaultItems: [],
    filteredItems: [],
    searchQuery: '',
    selectedTag: null,
    isLoading: false,
    error: null,
    isModalOpen: false,
    editingItem: null,
    
    setVaultItems: (items) => {
        set({ vaultItems: items, filteredItems: items });
    },
    
    addVaultItem: (item) => {
        set((state) => {
            const newItems = [item, ...state.vaultItems];
            return { vaultItems: newItems };
        });
        get().filterItems();
    },
    
    updateVaultItem: (id, updatedItem) => {
        set((state) => {
            const newItems = state.vaultItems.map((item) =>
                item._id === id ? { ...item, ...updatedItem } : item
            );
            return { vaultItems: newItems };
        });
        get().filterItems();
    },
    
    deleteVaultItem: (id) => {
        set((state) => ({
            vaultItems: state.vaultItems.filter((item) => item._id !== id),
        }));
        get().filterItems();
    },
    
    setSearchQuery: (query) => {
        set({ searchQuery: query });
        get().filterItems();
    },
    
    setSelectedTag: (tag) => {
        set({ selectedTag: tag });
        get().filterItems();
    },
    
    filterItems: () => {
        const { vaultItems, searchQuery, selectedTag } = get();
        let filtered = [...vaultItems];
        
        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((item) =>
                item.title.toLowerCase().includes(query) ||
                item.url?.toLowerCase().includes(query) ||
                item.notes?.toLowerCase().includes(query)
            );
        }
        
        // Filter by tag
        if (selectedTag) {
            filtered = filtered.filter((item) =>
                item.tags?.includes(selectedTag)
            );
        }
        
        set({ filteredItems: filtered });
    },
    
    setLoading: (loading) => set({ isLoading: loading }),
    
    setError: (error) => set({ error }),
    
    openModal: (item) => {
        set({ isModalOpen: true, editingItem: item || null });
    },
    
    closeModal: () => {
        set({ isModalOpen: false, editingItem: null });
    },
    
    // API calls
    fetchVaultItems: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/vault');
            if (!response.ok) throw new Error('Failed to fetch vault items');
            const data = await response.json();
            set({ vaultItems: data.vaultItems, filteredItems: data.vaultItems });
        } catch (error) {
            set({ error: (error as Error).message });
        } finally {
            set({ isLoading: false });
        }
    },
    
    createVaultItem: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/vault', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to create vault item');
            const result = await response.json();
            get().addVaultItem(result.vault);
            get().closeModal();
        } catch (error) {
            set({ error: (error as Error).message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    
    editVaultItem: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/vault/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to update vault item');
            const result = await response.json();
            get().updateVaultItem(id, result.vault);
            get().closeModal();
        } catch (error) {
            set({ error: (error as Error).message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    
    removeVaultItem: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/vault/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete vault item');
            get().deleteVaultItem(id);
        } catch (error) {
            set({ error: (error as Error).message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));
