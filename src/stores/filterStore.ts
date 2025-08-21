import { create } from 'zustand';
import type { FilterState } from '../types/FilterState';

const initialFilters: FilterState = {
  status: 'all',
  category: 'all',
  isFavorite: false,
};

interface FilterStoreState {
  filters: FilterState;
  activeSmartTags: string[];
  setFilters: (newFilters: Partial<FilterState>) => void;
  toggleSmartTag: (tag: string) => void;
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
