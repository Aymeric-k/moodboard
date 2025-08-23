import type { IThemeService } from './interfaces';

const THEME_STORAGE_KEY = 'moodboard-theme';

export class LocalStorageThemeService implements IThemeService {
  async getCurrentTheme(): Promise<string> {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        const parsed = JSON.parse(savedTheme);
        const themeId = parsed.state?.currentTheme;
        if (themeId) {
          return themeId;
        }
      }
      // Retourner le thème par défaut si aucun thème sauvegardé
      return 'dark-blue';
    } catch (error) {
      console.error('Failed to get current theme:', error);
      return 'dark-blue';
    }
  }

  async setTheme(themeId: string): Promise<void> {
    try {
      const currentData = localStorage.getItem(THEME_STORAGE_KEY);
      let themeData;

      if (currentData) {
        try {
          themeData = JSON.parse(currentData);
        } catch {
          themeData = { state: {} };
        }
      } else {
        themeData = { state: {} };
      }

      // Mettre à jour le thème
      themeData.state.currentTheme = themeId;

      // Sauvegarder
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themeData));
    } catch (error) {
      console.error('Failed to set theme:', error);
      throw new Error('Failed to persist theme');
    }
  }
}
