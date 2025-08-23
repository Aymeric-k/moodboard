import type { IUIService } from './interfaces';

export class LocalStorageUIService implements IUIService {
  private readonly UI_KEY = 'moodboard-ui';

  private getDefaultUIState() {
    return {
      isAddWorkModalOpen: false,
      isConfirmationModalOpen: false,
      confirmationModalData: null,
      notesModalWorkId: null,
      isFilterMenuOpen: false,
    };
  }

  async getModalState() {
    try {
      const stored = localStorage.getItem(this.UI_KEY);
      if (!stored) return this.getDefaultUIState();

      const uiState = JSON.parse(stored);
      return { ...this.getDefaultUIState(), ...uiState };
    } catch (error) {
      console.error('Error loading UI state from localStorage:', error);
      return this.getDefaultUIState();
    }
  }

  async setModalState(modal: string, isOpen: boolean, data?: unknown): Promise<void> {
    try {
      const currentState = await this.getModalState();

      const updatedState = { ...currentState };

      switch (modal) {
        case 'addWork':
          updatedState.isAddWorkModalOpen = isOpen;
          break;
        case 'confirmation':
          updatedState.isConfirmationModalOpen = isOpen;
          updatedState.confirmationModalData = isOpen ? data : null;
          break;
        case 'notes':
          updatedState.notesModalWorkId = isOpen ? data : null;
          break;
        case 'filterMenu':
          updatedState.isFilterMenuOpen = isOpen;
          break;
        default:
          console.warn(`Unknown modal type: ${modal}`);
          return;
      }

      localStorage.setItem(this.UI_KEY, JSON.stringify(updatedState));
    } catch (error) {
      console.error('Error saving UI state to localStorage:', error);
      throw new Error('Failed to save UI state');
    }
  }
}
