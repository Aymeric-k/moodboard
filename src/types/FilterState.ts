import type { WorkCategory } from './WorkType';

export type FilterState = {
  status: 'all' | 'backlog' | 'in-progress' | 'completed';
  category: 'all' | WorkCategory;
  isFavorite: boolean;
  searchQuery: string;
};
