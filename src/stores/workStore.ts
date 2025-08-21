import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WorkType } from '../types/WorkType';
import type { WorkProgressEvent } from '../types/WorkProgressEvent';

// Définition du "shape" de notre store : l'état et les actions
interface WorkState {
  works: WorkType[];
  progressEvents: WorkProgressEvent[];
  addWork: (newWorkData: Omit<WorkType, 'id' | 'createdAtISO' | 'status' | 'progress' | 'completedAtISO'>) => void;
  updateWork: (updatedWork: WorkType) => void;
  deleteWork: (workId: string) => void;
  getWorkById: (workId: string) => WorkType | undefined;
}

// Création du store
export const useWorkStore = create<WorkState>()(
  // On utilise le middleware `persist` pour sauvegarder automatiquement dans le localStorage
  persist(
    (set, get) => ({
      works: [], // L'état initial est maintenant un tableau vide.
      progressEvents: [], // État initial pour les événements de progression

      // Action pour ajouter une œuvre
      addWork: (newWorkData) => {
        const newWork: WorkType = {
          id: crypto.randomUUID(),
          createdAtISO: new Date().toISOString(),
          status: 'backlog',
          progress: 0,
          ...newWorkData,
        };
        set(state => ({ works: [newWork, ...state.works] }));
      },

      // Action pour mettre à jour une œuvre
      updateWork: (updatedWork) => {
                const originalWork = get().getWorkById(updatedWork.id);

        // Si la progression a augmenté, on crée un événement
        if (originalWork && updatedWork.progress > originalWork.progress) {
          const newEvent: WorkProgressEvent = {
            id: crypto.randomUUID(),
            workId: updatedWork.id,
            progress: updatedWork.progress,
            tsISO: new Date().toISOString(),
          };
          set(state => ({ progressEvents: [...state.progressEvents, newEvent] }));
        }
        set(state => ({
          works: state.works.map(work =>
            work.id === updatedWork.id ? updatedWork : work
          ),
        }));
         if (updatedWork.status === 'in-progress') {
          localStorage.setItem('moodboard-last-interacted-work-id', updatedWork.id);
        }
      },

      // Action pour supprimer une œuvre
      deleteWork: (workId) => {
        set(state => ({
          works: state.works.filter(work => work.id !== workId),
        }));
      },

      // "Getter" pour récupérer une œuvre par son ID
      getWorkById: (workId) => {
        return get().works.find(w => w.id === workId);
      }
    }),
    {
    name: 'moodboard-storage', // Nouvelle clé plus générique pour tout notre état
      storage: createJSONStorage(() => localStorage),
      // On spécifie quelles parties de l'état on veut persister.
      partialize: (state) => ({
        works: state.works,
        progressEvents: state.progressEvents,
      }),
    }
  )
);
