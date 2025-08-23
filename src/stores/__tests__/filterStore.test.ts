import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useFilterStore } from '../filterStore';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('filterStore', () => {
  beforeEach(async () => {
    // Reset le store avant chaque test
    useFilterStore.setState({
      filters: {
        status: 'all',
        category: 'all',
        isFavorite: false,
        searchQuery: '',
      },
      activeSmartTags: [],
      isLoading: false,
      error: null,
    });

    // Reset les mocks
    vi.clearAllMocks();

    // Initialiser les services
    await useFilterStore.getState().initialize();
  });

  describe('setFilters', () => {
    it('should update individual filter values', async () => {
      const { setFilters } = useFilterStore.getState();

      await setFilters({ status: 'in-progress' });

      const { filters } = useFilterStore.getState();
      expect(filters.status).toBe('in-progress');
      expect(filters.category).toBe('all'); // Non modifié
      expect(filters.isFavorite).toBe(false); // Non modifié
    });

    it('should update multiple filters at once', async () => {
      const { setFilters } = useFilterStore.getState();

      await setFilters({
        status: 'completed',
        category: 'book',
        isFavorite: true
      });

      const { filters } = useFilterStore.getState();
      expect(filters.status).toBe('completed');
      expect(filters.category).toBe('book');
      expect(filters.isFavorite).toBe(true);
    });

    it('should update search query', () => {
      const { setFilters } = useFilterStore.getState();

      setFilters({ searchQuery: 'test search' });

      const { filters } = useFilterStore.getState();
      expect(filters.searchQuery).toBe('test search');
    });
  });

  describe('toggleSmartTag', () => {
    it('should add a smart tag when not present', () => {
      const { toggleSmartTag } = useFilterStore.getState();

      let { activeSmartTags } = useFilterStore.getState();
      expect(activeSmartTags).toHaveLength(0);

      toggleSmartTag('quick');

      ({ activeSmartTags } = useFilterStore.getState());
      expect(activeSmartTags).toContain('quick');
      expect(activeSmartTags).toHaveLength(1);
    });

    it('should remove a smart tag when already present', () => {
      const { toggleSmartTag } = useFilterStore.getState();

      // Ajouter d'abord
      toggleSmartTag('quick');
      let { activeSmartTags } = useFilterStore.getState();
      expect(activeSmartTags).toContain('quick');

      // Puis retirer
      toggleSmartTag('quick');
      ({ activeSmartTags } = useFilterStore.getState());
      expect(activeSmartTags).not.toContain('quick');
      expect(activeSmartTags).toHaveLength(0);
    });

    it('should handle multiple smart tags', () => {
      const { toggleSmartTag } = useFilterStore.getState();

      toggleSmartTag('quick');
      toggleSmartTag('withFriend');

      let { activeSmartTags } = useFilterStore.getState();
      expect(activeSmartTags).toHaveLength(2);
      expect(activeSmartTags).toContain('quick');
      expect(activeSmartTags).toContain('withFriend');

      // Retirer un seul
      toggleSmartTag('quick');
      ({ activeSmartTags } = useFilterStore.getState());
      expect(activeSmartTags).toHaveLength(1);
      expect(activeSmartTags).toContain('withFriend');
      expect(activeSmartTags).not.toContain('quick');
    });
  });

  describe('resetAllFilters', () => {
    it('should reset all filters to default values', () => {
      const { setFilters, resetAllFilters, toggleSmartTag } = useFilterStore.getState();

      // Modifier les filtres
      setFilters({
        status: 'completed',
        category: 'book',
        searchQuery: 'test',
        isFavorite: true
      });
      toggleSmartTag('quick');
      toggleSmartTag('withFriend');

      // Vérifier qu'ils sont modifiés
      let { filters, activeSmartTags } = useFilterStore.getState();
      expect(filters.status).toBe('completed');
      expect(filters.category).toBe('book');
      expect(filters.searchQuery).toBe('test');
      expect(filters.isFavorite).toBe(true);
      expect(activeSmartTags).toHaveLength(2);

      // Reset
      resetAllFilters();

      // Vérifier qu'ils sont reset
      ({ filters, activeSmartTags } = useFilterStore.getState());
      expect(filters.status).toBe('all');
      expect(filters.category).toBe('all');
      expect(filters.searchQuery).toBe('');
      expect(filters.isFavorite).toBe(false);
      expect(activeSmartTags).toHaveLength(0);
    });
  });

  describe('filter state persistence', () => {
    it('should maintain filter state across operations', () => {
      const { setFilters, toggleSmartTag } = useFilterStore.getState();

      // Configurer un état complexe
      setFilters({
        status: 'in-progress',
        category: 'book',
        searchQuery: 'project',
        isFavorite: false
      });
      toggleSmartTag('quick');
      toggleSmartTag('withFriend');

      // Vérifier l'état
      let { filters, activeSmartTags } = useFilterStore.getState();
      expect(filters.status).toBe('in-progress');
      expect(filters.category).toBe('book');
      expect(filters.searchQuery).toBe('project');
      expect(filters.isFavorite).toBe(false);
      expect(activeSmartTags).toHaveLength(2);
      expect(activeSmartTags).toContain('quick');
      expect(activeSmartTags).toContain('withFriend');

      // Modifier un seul filtre
      setFilters({ status: 'completed' });

      // Vérifier que les autres sont préservés
      ({ filters, activeSmartTags } = useFilterStore.getState());
      expect(filters.status).toBe('completed');
      expect(filters.category).toBe('book');
      expect(filters.searchQuery).toBe('project');
      expect(filters.isFavorite).toBe(false);
      expect(activeSmartTags).toHaveLength(2);
    });
  });
});
