import { create } from 'zustand';
import type { FilterState } from '../types/FilterState';
import type { SmartTag } from '../types/SmartTag';

const initialFilters: FilterState = {
  status: 'all',
  category: 'all',
  isFavorite: false,
  searchQuery: '',
};

interface FilterStoreState {
  filters: FilterState;
  activeSmartTags: SmartTag[];
  setFilters: (newFilters: Partial<FilterState>) => void;
  toggleSmartTag: (tag: SmartTag) => void;
  resetAllFilters: () => void;
}

export const useFilterStore = create<FilterStoreState>((set) => ({
  filters: initialFilters,
  activeSmartTags: [],
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
  })),
  toggleSmartTag: (tag) => set((state) => {
    const newTags = new Set(state.activeSmartTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    return { activeSmartTags: Array.from(newTags) };
  }),
  resetAllFilters: () => set({
    filters: initialFilters,
    activeSmartTags: [],
  }),
}));
