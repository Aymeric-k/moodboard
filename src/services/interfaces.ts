import type { WorkType } from '../types/WorkType';
import type { MoodType } from '../types/MoodType';
import type { WorkProgressEvent } from '../types/WorkProgressEvent';

// Interface pour le service de gestion des works
export interface IWorkService {
  // Récupération
  getAllWorks(): Promise<WorkType[]>;
  getWorkById(id: string): Promise<WorkType | null>;

  // Modification
  createWork(workData: Omit<WorkType, 'id' | 'createdAtISO' | 'status' | 'progress'>): Promise<WorkType>;
  updateWork(work: WorkType): Promise<WorkType>;
  deleteWork(id: string): Promise<boolean>;

  // Événements de progression
  getProgressEvents(): Promise<WorkProgressEvent[]>;
  addProgressEvent(event: Omit<WorkProgressEvent, 'id' | 'tsISO'>): Promise<WorkProgressEvent>;
}

// Interface pour le service de gestion des moods
export interface IMoodService {
  getAllMoods(): Promise<MoodType[]>;
  getMoodById(id: number): Promise<MoodType | null>;

  // Gestion des moods du jour
  getTodayMoodsData(): Promise<{
    date: string;
    moods: number[];
  }>;
  setTodayMoodsData(data: {
    date: string;
    moods: number[];
  }): Promise<void>;

  // Gestion des événements historiques
  getHistoricalEvents(): Promise<{
    id: string;
    moodId: number;
    tsISO: string;
  }[]>;
  setHistoricalEvents(events: {
    id: string;
    moodId: number;
    tsISO: string;
  }[]): Promise<void>;
}

// Interface pour le service de gestion des filtres
export interface IFilterService {
  getFilters(): Promise<{
    status: "backlog" | "in-progress" | "completed" | "all";
    category: "all" | "book" | "movie" | "series" | "video-game" | "music" | "other";
    isFavorite: boolean;
    searchQuery: string;
  }>;
  setFilters(filters: Partial<{
    status: "backlog" | "in-progress" | "completed" | "all";
    category: "all" | "book" | "movie" | "series" | "video-game" | "music" | "other";
    isFavorite: boolean;
    searchQuery: string;
  }>): Promise<void>;

  getActiveSmartTags(): Promise<("lateNight" | "quick" | "long" | "withFriend" | "solo")[]>;
  toggleSmartTag(tag: "lateNight" | "quick" | "long" | "withFriend" | "solo"): Promise<void>;
  resetAllFilters(): Promise<void>;
}

// Interface pour le service de gestion des thèmes
export interface IThemeService {
  getCurrentTheme(): Promise<string>;
  setTheme(themeId: string): Promise<void>;
}

// Interface pour le service de gestion de l'UI
export interface IUIService {
  getModalState(): Promise<{
    isAddWorkModalOpen: boolean;
    isConfirmationModalOpen: boolean;
    confirmationModalData: any;
    notesModalWorkId: string | null;
    isFilterMenuOpen: boolean;
  }>;

  setModalState(modal: string, isOpen: boolean, data?: any): Promise<void>;
}
