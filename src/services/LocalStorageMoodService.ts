import type { IMoodService } from './interfaces';
import type { MoodType } from '../types/MoodType';

export class LocalStorageMoodService implements IMoodService {
  private readonly MOODS_KEY = 'moodboard-moods';
  private readonly TODAY_MOODS_KEY = 'moodboard-today-moods';
  private readonly HISTORICAL_EVENTS_KEY = 'moodboard-historical-events';

  // Récupération des moods
  async getAllMoods(): Promise<MoodType[]> {
    try {
      const stored = localStorage.getItem(this.MOODS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get all moods:', error);
      return [];
    }
  }

  async getMoodById(id: number): Promise<MoodType | null> {
    try {
      const moods = await this.getAllMoods();
      return moods.find(mood => mood.id === id) || null;
    } catch (error) {
      console.error('Failed to get mood by id:', error);
      return null;
    }
  }

  // Gestion des moods du jour
  async getTodayMoodsData(): Promise<{
    date: string;
    moods: number[];
  }> {
    try {
      const stored = localStorage.getItem(this.TODAY_MOODS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }

      // Valeur par défaut
      const today = new Intl.DateTimeFormat('fr-CA').format(new Date());
      return {
        date: today,
        moods: []
      };
    } catch (error) {
      console.error('Failed to get today moods data:', error);
      const today = new Intl.DateTimeFormat('fr-CA').format(new Date());
      return {
        date: today,
        moods: []
      };
    }
  }

  async setTodayMoodsData(data: {
    date: string;
    moods: number[];
  }): Promise<void> {
    console.time('💾 Service setTodayMoodsData');
    try {
      localStorage.setItem(this.TODAY_MOODS_KEY, JSON.stringify(data));
      console.timeEnd('💾 Service setTodayMoodsData');
    } catch (error) {
      console.error('Failed to set today moods data:', error);
      console.timeEnd('💾 Service setTodayMoodsData');
      throw error;
    }
  }

  // Gestion des événements historiques
  async getHistoricalEvents(): Promise<{
    id: string;
    moodId: number;
    tsISO: string;
  }[]> {
    try {
      const stored = localStorage.getItem(this.HISTORICAL_EVENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get historical events:', error);
      return [];
    }
  }

  async setHistoricalEvents(events: {
    id: string;
    moodId: number;
    tsISO: string;
  }[]): Promise<void> {
    try {
      localStorage.setItem(this.HISTORICAL_EVENTS_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Failed to set historical events:', error);
      throw error;
    }
  }
}
