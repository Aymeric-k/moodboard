import { create } from 'zustand';
import type { IThemeService } from '../services/interfaces';

export type ThemeType = 'dark-blue' | 'purple' | 'green' | 'orange' | 'rose';

export interface Theme {
  id: ThemeType;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundDark: string;
  surface: string;
  text: string;
  textSecondary: string;
}

export const THEMES: Record<ThemeType, Theme> = {
  'dark-blue': {
    id: 'dark-blue',
    name: 'Dark Blue',
    primary: '#1e293b', // slate-800
    secondary: '#334155', // slate-700
    accent: '#3b82f6', // blue-500
    background: '#0f172a', // slate-900
    backgroundDark: '#0c1421', // slate-950
    surface: '#1e293b', // slate-800
    text: '#e2e8f0', // slate-200 - blanc plus foncé
    textSecondary: '#cbd5e1', // slate-300 - gris plus foncé
  },
  'purple': {
    id: 'purple',
    name: 'Purple',
    primary: '#581c87', // purple-800
    secondary: '#7c3aed', // purple-600
    accent: '#a855f7', // purple-500
    background: '#1e1b4b', // indigo-900
    backgroundDark: '#312e81', // indigo-700
    surface: '#3730a3', // indigo-800
    text: '#c7d2fe', // indigo-200 - bleu plus foncé
    textSecondary: '#a5b4fc', // indigo-300 - bleu clair
  },
  'green': {
    id: 'green',
    name: 'Green',
    primary: '#166534', // green-800
    secondary: '#16a34a', // green-600
    accent: '#22c55e', // green-500
    background: '#052e16', // green-900
    backgroundDark: '#064e3b', // green-800
    surface: '#14532d', // green-800
    text: '#bbf7d0', // green-200 - vert plus foncé
    textSecondary: '#86efac', // green-300 - vert clair
  },
  'orange': {
    id: 'orange',
    name: 'Orange',
    primary: '#9a3412', // orange-800
    secondary: '#ea580c', // orange-600
    accent: '#f97316', // orange-500
    background: '#451a03', // orange-900
    backgroundDark: '#92400e', // orange-800
    surface: '#7c2d12', // orange-800
    text: '#fed7aa', // orange-200 - orange plus foncé
    textSecondary: '#fdba74', // orange-300 - orange encore plus foncé
  },
  'rose': {
    id: 'rose',
    name: 'Rose',
    primary: '#be185d', // rose-700
    secondary: '#e11d48', // rose-600
    accent: '#f43f5e', // rose-500
    background: '#881337', // rose-900
    backgroundDark: '#9d174d', // rose-800
    surface: '#be185d', // rose-700
    text: '#fecdd3', // rose-200 - rose plus foncé
    textSecondary: '#fda4af', // rose-300 - rose clair
  },
};

// Thème par défaut - mon préféré ! 🎨
const DEFAULT_THEME: ThemeType = 'dark-blue';

interface ThemeStoreState {
  currentTheme: ThemeType;
  themeService: IThemeService | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTheme: (theme: ThemeType) => Promise<void>;
  getCurrentTheme: () => Theme;
  initializeTheme: () => Promise<void>;

  // Initialisation
  initialize: (themeService: IThemeService) => Promise<void>;
}

export const useThemeStore = create<ThemeStoreState>((set, get) => ({
  currentTheme: DEFAULT_THEME,
  themeService: null,
  isLoading: false,
  error: null,

  // Initialisation avec le service
  initialize: async (themeService: IThemeService) => {
    try {
      set({ isLoading: true, error: null, themeService });

      const savedTheme = await themeService.getCurrentTheme();
      const themeType = savedTheme as ThemeType;

      if (THEMES[themeType]) {
        set({ currentTheme: themeType });
        applyThemeToDOM(themeType);
      } else {
        set({ currentTheme: DEFAULT_THEME });
        applyThemeToDOM(DEFAULT_THEME);
      }

      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize theme',
        isLoading: false
      });
    }
  },

  setTheme: async (theme: ThemeType) => {
    const { themeService } = get();
    if (!themeService) {
      set({ error: 'Theme service not initialized' });
      return;
    }

    try {
      // Mise à jour immédiate de l'UI
      set({ currentTheme: theme });
      applyThemeToDOM(theme);

      // Persistence différée (asynchrone en arrière-plan)
      themeService.setTheme(theme).catch(error => {
        console.error('Failed to persist theme:', error);
        set({ error: 'Failed to persist theme' });
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to set theme'
      });
    }
  },

  getCurrentTheme: () => {
    const { currentTheme } = get();
    return THEMES[currentTheme];
  },

  initializeTheme: async () => {
    const { currentTheme } = get();
    // S'assurer qu'un thème est toujours appliqué
    applyThemeToDOM(currentTheme);
  },
}));

// Fonction pour appliquer le thème au DOM
function applyThemeToDOM(themeId: ThemeType) {
  const theme = THEMES[themeId];
  if (!theme) {
    console.warn(`Theme ${themeId} not found, falling back to default`);
    themeId = DEFAULT_THEME;
  }

  const body = document.body;
  const appRoot = document.getElementById('app-root');

  // Appliquer les variables CSS custom properties au body (pour boutons, titres, etc.)
  body.style.setProperty('--color-primary', theme.primary);
  body.style.setProperty('--color-secondary', theme.secondary);
  body.style.setProperty('--color-accent', theme.accent);
  body.style.setProperty('--color-surface', theme.surface);
  body.style.setProperty('--color-text', theme.text);
  body.style.setProperty('--color-text-secondary', theme.textSecondary);

  // Supprimer toutes les anciennes classes de thème
  body.classList.remove('theme-dark-blue', 'theme-purple', 'theme-green', 'theme-orange', 'theme-rose');

  if (appRoot) {
    // Supprimer toutes les anciennes classes de dégradé
    appRoot.classList.remove('gradient-dark-blue', 'gradient-purple', 'gradient-green', 'gradient-orange', 'gradient-rose');

    // Appliquer le dégradé CSS personnalisé approprié
    switch (themeId) {
      case 'dark-blue':
        appRoot.classList.add('gradient-dark-blue');
        break;
      case 'purple':
        appRoot.classList.add('gradient-purple');
        break;
      case 'green':
        appRoot.classList.add('gradient-green');
        break;
      case 'orange':
        appRoot.classList.add('gradient-orange');
        break;
      case 'rose':
        appRoot.classList.add('gradient-rose');
        break;
    }
  }

  // Ajouter la classe du thème actuel au body
  body.classList.add(`theme-${themeId}`);
}

// Initialisation robuste du thème au chargement
if (typeof window !== 'undefined') {
  // Attendre que le DOM soit prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Essayer de récupérer le thème sauvegardé
      const savedTheme = localStorage.getItem('moodboard-theme');
      if (savedTheme) {
        try {
          const parsed = JSON.parse(savedTheme);
          const savedThemeId = parsed.state?.currentTheme as ThemeType;
          if (savedThemeId && THEMES[savedThemeId]) {
            applyThemeToDOM(savedThemeId);
          } else {
            applyThemeToDOM(DEFAULT_THEME);
          }
        } catch (error) {
          console.warn('Failed to parse saved theme, using default:', error);
          applyThemeToDOM(DEFAULT_THEME);
        }
      } else {
        // Première visite - appliquer le thème par défaut
        applyThemeToDOM(DEFAULT_THEME);
      }
    });
  } else {
    // DOM déjà prêt
    const savedTheme = localStorage.getItem('moodboard-theme');
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        const savedThemeId = parsed.state?.currentTheme as ThemeType;
        if (savedThemeId && THEMES[savedThemeId]) {
          applyThemeToDOM(savedThemeId);
        } else {
          applyThemeToDOM(DEFAULT_THEME);
        }
      } catch (error) {
        console.warn('Failed to parse saved theme, using default:', error);
        applyThemeToDOM(DEFAULT_THEME);
      }
    } else {
      // Première visite - appliquer le thème par défaut
      applyThemeToDOM(DEFAULT_THEME);
    }
  }
}
