import { create } from 'zustand';
import type { WorkType } from '../types/WorkType';
import type { WorkProgressEvent } from '../types/WorkProgressEvent';
import type { IWorkService } from '../services/interfaces';

// Définition du "shape" de notre store : l'état et les actions
interface WorkState {
  works: WorkType[];
  progressEvents: WorkProgressEvent[];
  isLoading: boolean;
  error: string | null;

  // Service injecté
  workService: IWorkService | null;

  // Actions
  addWork: (newWorkData: Omit<WorkType, 'id' | 'createdAtISO' | 'status' | 'progress' | 'completedAtISO'>) => Promise<void>;
  updateWork: (updatedWork: WorkType) => Promise<void>;
  deleteWork: (workId: string) => Promise<void>;
  getWorkById: (workId: string) => WorkType | undefined;

  // Initialisation
  initialize: (workService: IWorkService) => Promise<void>;
  refreshWorks: () => Promise<void>;
}

// Création du store
export const useWorkStore = create<WorkState>()((set, get) => ({
  works: [],
  progressEvents: [],
  isLoading: false,
  error: null,
  workService: null,

    // Initialisation avec le service
  initialize: async (workService: IWorkService) => {
    try {
      set({ isLoading: true, error: null, workService });

      const [works, progressEvents] = await Promise.all([
        workService.getAllWorks(),
        workService.getProgressEvents()
      ]);

      set({ works, progressEvents, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize works',
        isLoading: false
      });
    }
  },

  // Rafraîchir les works depuis le service
  refreshWorks: async () => {
    const { workService } = get();
    if (!workService) return;

    try {
      set({ isLoading: true, error: null });
      const works = await workService.getAllWorks();
      set({ works, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to refresh works',
        isLoading: false
      });
    }
  },

  // Action pour ajouter une œuvre
  addWork: async (newWorkData) => {
    const { workService } = get();
    if (!workService) {
      set({ error: 'Work service not initialized' });
      return;
    }

    try {
      // Créer le work avec un ID temporaire pour l'UI immédiate
      const tempWork = {
        ...newWorkData,
        id: crypto.randomUUID(),
        createdAtISO: new Date().toISOString(),
        status: 'backlog' as const,
        progress: 0
      };

      // Mise à jour immédiate de l'UI (synchrone)
      set(state => ({
        works: [tempWork, ...state.works]
      }));

      // Persistence différée (asynchrone en arrière-plan)
      workService.createWork(newWorkData).then(realWork => {
        // Remplacer le work temporaire par le vrai
        set((state) => ({
          works: state.works.map(w => w.id === tempWork.id ? realWork : w)
        }));
      }).catch(error => {
        console.error('Failed to persist work:', error);
        set({ error: 'Failed to persist work' });
        // Retirer le work temporaire en cas d'échec
        set((state) => ({
          works: state.works.filter(w => w.id !== tempWork.id)
        }));
      });

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add work'
      });
    }
  },

  // Action pour mettre à jour une œuvre
  updateWork: async (updatedWork) => {
    const { workService } = get();
    if (!workService) {
      set({ error: 'Work service not initialized' });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      const originalWork = get().getWorkById(updatedWork.id);

      // Si la progression a augmenté, on crée un événement
      if (originalWork && updatedWork.progress > originalWork.progress) {
        const newEvent: WorkProgressEvent = {
          id: crypto.randomUUID(),
          workId: updatedWork.id,
          progress: updatedWork.progress,
          tsISO: new Date().toISOString(),
        };

        await workService.addProgressEvent(newEvent);
        set(state => ({
          progressEvents: [...state.progressEvents, newEvent]
        }));
      }

      // Mettre à jour le work
      const updatedWorkFromService = await workService.updateWork(updatedWork);

      set(state => ({
        works: state.works.map(work =>
          work.id === updatedWorkFromService.id ? updatedWorkFromService : work
        ),
        isLoading: false
      }));

      // Sauvegarder l'ID du dernier work interacté
      if (updatedWork.status === 'in-progress') {
        localStorage.setItem('moodboard-last-interacted-work-id', updatedWork.id);
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update work',
        isLoading: false
      });
    }
  },

  // Action pour supprimer une œuvre
  deleteWork: async (workId) => {
    const { workService } = get();
    if (!workService) {
      set({ error: 'Work service not initialized' });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      const success = await workService.deleteWork(workId);

      if (success) {
        set(state => ({
          works: state.works.filter(work => work.id !== workId),
          isLoading: false
        }));
      } else {
        set({
          error: 'Work not found or could not be deleted',
          isLoading: false
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete work',
        isLoading: false
      });
    }
  },

  // "Getter" pour récupérer une œuvre par son ID
  getWorkById: (workId) => {
    return get().works.find(w => w.id === workId);
  }
}));
