import { create } from 'zustand';
import type { FilterState } from '../types/FilterState';
import type { SmartTag } from '../types/SmartTag';
import type { IFilterService } from '../services/interfaces';

const initialFilters: FilterState = {
  status: 'all',
  category: 'all',
  isFavorite: false,
  searchQuery: '',
};

interface FilterStoreState {
  filters: FilterState;
  activeSmartTags: SmartTag[];
  filterService: IFilterService | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setFilters: (newFilters: Partial<FilterState>) => Promise<void>;
  toggleSmartTag: (tag: SmartTag) => Promise<void>;
  resetAllFilters: () => Promise<void>;

  // Initialisation
  initialize: (filterService: IFilterService) => Promise<void>;
}

export const useFilterStore = create<FilterStoreState>((set, get) => ({
  filters: initialFilters,
  activeSmartTags: [],
  filterService: null,
  isLoading: false,
  error: null,

  // Initialisation avec le service
  initialize: async (filterService: IFilterService) => {
    try {
      set({ isLoading: true, error: null, filterService });

      const [filters, activeSmartTags] = await Promise.all([
        filterService.getFilters(),
        filterService.getActiveSmartTags()
      ]);

      set({ filters, activeSmartTags, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize filters',
        isLoading: false
      });
    }
  },

    // Actions
  setFilters: async (newFilters) => {
    const { filterService } = get();
    if (!filterService) {
      set({ error: 'Filter service not initialized' });
      return;
    }

    try {
      // Mise à jour immédiate de l'UI (synchrone)
      const updatedFilters = { ...get().filters, ...newFilters };
      set({ filters: updatedFilters });

      // Persistence différée (asynchrone en arrière-plan)
      filterService.setFilters(updatedFilters).catch(error => {
        console.error('Failed to persist filters:', error);
        set({ error: 'Failed to persist filters' });
      });

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to set filters'
      });
    }
  },

    toggleSmartTag: async (tag) => {
    const { filterService } = get();
    if (!filterService) {
      set({ error: 'Filter service not initialized' });
      return;
    }

    try {
      // Mise à jour immédiate de l'UI (synchrone)
      const newTags = new Set(get().activeSmartTags);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }

      set({ activeSmartTags: Array.from(newTags) });

      // Persistence différée (asynchrone en arrière-plan)
      filterService.toggleSmartTag(tag).catch(error => {
        console.error('Failed to persist smart tag:', error);
        set({ error: 'Failed to persist smart tag' });
      });

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to toggle smart tag'
      });
    }
  },

  resetAllFilters: async () => {
    const { filterService } = get();
    if (!filterService) {
      set({ error: 'Filter service not initialized' });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      await filterService.resetAllFilters();

      set({
        filters: initialFilters,
        activeSmartTags: [],
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reset filters',
        isLoading: false
      });
    }
  },
}));
