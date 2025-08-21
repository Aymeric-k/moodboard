export type WorkCategory = 'book' | 'movie' | 'series' | 'video-game' | 'music' | 'other';
import type { SmartTag } from './SmartTag';

export interface WorkType {
  id: string;
  title: string;
  category: WorkCategory
  imageUrl: string;
  moodId: number[];
  createdAtISO: string;
  status: 'backlog' | 'in-progress' | 'completed';
  progress: number; // Progress from 0 to 100
  completedAtISO?: string;
  isFavorite?: boolean;
  lastSuggestedAtISO?: string;
  smartTags?: SmartTag[];
  notes?: string;
}
