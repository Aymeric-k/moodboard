import { create } from 'zustand';

interface UIState {
  // Modal for deleting a work. The presence of an ID means the modal is open.
  workToDeleteId: string | null;
  openDeleteModal: (workId: string) => void;
  closeDeleteModal: () => void;

  // Prompt for updating progress
  workToPromptForProgressId: string | null;
  setWorkToPromptForProgress: (workId: string | null) => void;

  // Filter menu visibility
  isFilterMenuOpen: boolean;
  toggleFilterMenu: () => void;
  closeFilterMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  workToDeleteId: null,
  openDeleteModal: (workId) => set({ workToDeleteId: workId }),
  closeDeleteModal: () => set({ workToDeleteId: null }),

  workToPromptForProgressId: null,
  setWorkToPromptForProgress: (workId) => set({ workToPromptForProgressId: workId }),

  isFilterMenuOpen: false,
  toggleFilterMenu: () => set((state) => ({ isFilterMenuOpen: !state.isFilterMenuOpen })),
  closeFilterMenu: () => set({ isFilterMenuOpen: false }),
}));

