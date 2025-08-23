export interface ExpertPick {
  id: string;
  expertId: string;
  workId?: string; // Optional si l'œuvre n'est pas encore dans notre DB
  title: string;
  author: string; // Obligatoire pour les livres
  category: 'book'; // Uniquement les livres
  shortWhy: string; // Max 60 chars pour carousel
  fullDescription: string; // Description complète pour hover/modal
  amazonLink?: string; // Lien affilié Amazon
  featured: boolean;
  isPickOfTheWeek: boolean; // Nouveau : Pick de la semaine
  weekOf: Date; // Semaine du pick (obligatoire)
  createdAt: Date;
  updatedAt: Date;
  tags?: string[]; // Genre, mood, etc.
  estimatedTime?: string; // "450 pages", "2h30", etc.
  targetMood?: string[]; // Moods recommandés
  difficulty?: 'easy' | 'medium' | 'challenging';
  isActive: boolean;
}

export interface ExpertPickAnalytics {
  pickId: string;
  views: number;
  hovers: number;
  clicks: number;
  addedToBacklog: number;
  amazonClicks: number;
  averageHoverTime: number;
  conversionRate: number;
  lastUpdated: Date;
}

export interface CarouselState {
  currentIndex: number;
  isPlaying: boolean;
  rotationInterval: number; // en millisecondes
  isPaused: boolean;
  lastInteraction: Date;
}
