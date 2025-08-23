import type { IFilterService } from './interfaces';

export class LocalStorageFilterService implements IFilterService {
  private readonly FILTERS_KEY = 'moodboard-filters';
  private readonly SMART_TAGS_KEY = 'moodboard-smart-tags';

  private getDefaultFilters() {
    return {
      status: 'all' as const,
      category: 'all' as const,
      isFavorite: false,
      searchQuery: '',
    };
  }

  async getFilters() {
    try {
      const stored = localStorage.getItem(this.FILTERS_KEY);
      if (!stored) return this.getDefaultFilters();

      const filters = JSON.parse(stored);
      return { ...this.getDefaultFilters(), ...filters };
    } catch (error) {
      console.error('Error loading filters from localStorage:', error);
      return this.getDefaultFilters();
    }
  }

  async setFilters(newFilters: Partial<{
    status: "backlog" | "in-progress" | "completed" | "all";
    category: "all" | "book" | "movie" | "series" | "video-game" | "music" | "other";
    isFavorite: boolean;
    searchQuery: string;
  }>) {
    try {
      const currentFilters = await this.getFilters();
      const updatedFilters = { ...currentFilters, ...newFilters };

      localStorage.setItem(this.FILTERS_KEY, JSON.stringify(updatedFilters));
    } catch (error) {
      console.error('Error saving filters to localStorage:', error);
      throw new Error('Failed to save filters');
    }
  }

  async getActiveSmartTags(): Promise<("lateNight" | "quick" | "long" | "withFriend" | "solo")[]> {
    try {
      const stored = localStorage.getItem(this.SMART_TAGS_KEY);
      if (!stored) return [];

      const tags = JSON.parse(stored);
      return Array.isArray(tags) ? tags : [];
    } catch (error) {
      console.error('Error loading smart tags from localStorage:', error);
      return [];
    }
  }

  async toggleSmartTag(tag: "lateNight" | "quick" | "long" | "withFriend" | "solo"): Promise<void> {
    try {
      const currentTags = await this.getActiveSmartTags();
      const updatedTags = currentTags.includes(tag)
        ? currentTags.filter(t => t !== tag)
        : [...currentTags, tag];

      localStorage.setItem(this.SMART_TAGS_KEY, JSON.stringify(updatedTags));
    } catch (error) {
      console.error('Error toggling smart tag:', error);
      throw new Error('Failed to toggle smart tag');
    }
  }

  async resetAllFilters(): Promise<void> {
    try {
      // Reset filters
      localStorage.removeItem(this.FILTERS_KEY);

      // Reset smart tags
      localStorage.removeItem(this.SMART_TAGS_KEY);
    } catch (error) {
      console.error('Error resetting filters:', error);
      throw new Error('Failed to reset filters');
    }
  }
}
