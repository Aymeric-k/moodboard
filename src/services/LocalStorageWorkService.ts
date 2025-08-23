import type { IWorkService } from './interfaces';
import type { WorkType } from '../types/WorkType';
import type { WorkProgressEvent } from '../types/WorkProgressEvent';

export class LocalStorageWorkService implements IWorkService {
  private readonly WORKS_KEY = 'moodboard-works';
  private readonly PROGRESS_EVENTS_KEY = 'moodboard-progress-events';

  async getAllWorks(): Promise<WorkType[]> {
    try {
      const stored = localStorage.getItem(this.WORKS_KEY);
      if (!stored) return [];

      const works = JSON.parse(stored);
      return Array.isArray(works) ? works : [];
    } catch (error) {
      console.error('Error loading works from localStorage:', error);
      return [];
    }
  }

  async getWorkById(id: string): Promise<WorkType | null> {
    try {
      const works = await this.getAllWorks();
      return works.find(work => work.id === id) || null;
    } catch (error) {
      console.error('Error getting work by ID:', error);
      return null;
    }
  }

  async createWork(workData: Omit<WorkType, 'id' | 'createdAtISO' | 'status' | 'progress'>): Promise<WorkType> {
    try {
      const works = await this.getAllWorks();

      const newWork: WorkType = {
        ...workData,
        id: crypto.randomUUID(),
        createdAtISO: new Date().toISOString(),
        status: 'backlog',
        progress: 0,
      };

      // Ajouter au début de la liste (comme dans le store actuel)
      const updatedWorks = [newWork, ...works];

      localStorage.setItem(this.WORKS_KEY, JSON.stringify(updatedWorks));

      return newWork;
    } catch (error) {
      console.error('Error creating work:', error);
      throw new Error('Failed to create work');
    }
  }

  async updateWork(work: WorkType): Promise<WorkType> {
    try {
      const works = await this.getAllWorks();
      const workIndex = works.findIndex(w => w.id === work.id);

      if (workIndex === -1) {
        throw new Error('Work not found');
      }

      works[workIndex] = work;
      localStorage.setItem(this.WORKS_KEY, JSON.stringify(works));

      return work;
    } catch (error) {
      console.error('Error updating work:', error);
      throw new Error('Failed to update work');
    }
  }

  async deleteWork(id: string): Promise<boolean> {
    try {
      const works = await this.getAllWorks();
      const filteredWorks = works.filter(work => work.id !== id);

      if (filteredWorks.length === works.length) {
        return false; // Work not found
      }

      localStorage.setItem(this.WORKS_KEY, JSON.stringify(filteredWorks));
      return true;
    } catch (error) {
      console.error('Error deleting work:', error);
      return false;
    }
  }

  async getProgressEvents(): Promise<WorkProgressEvent[]> {
    try {
      const stored = localStorage.getItem(this.PROGRESS_EVENTS_KEY);
      if (!stored) return [];

      const events = JSON.parse(stored);
      return Array.isArray(events) ? events : [];
    } catch (error) {
      console.error('Error loading progress events from localStorage:', error);
      return [];
    }
  }

  async addProgressEvent(eventData: Omit<WorkProgressEvent, 'id' | 'tsISO'>): Promise<WorkProgressEvent> {
    try {
      const events = await this.getProgressEvents();

      const newEvent: WorkProgressEvent = {
        ...eventData,
        id: crypto.randomUUID(),
        tsISO: new Date().toISOString(),
      };

      const updatedEvents = [newEvent, ...events];
      localStorage.setItem(this.PROGRESS_EVENTS_KEY, JSON.stringify(updatedEvents));

      return newEvent;
    } catch (error) {
      console.error('Error adding progress event:', error);
      throw new Error('Failed to add progress event');
    }
  }
}
