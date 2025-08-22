import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useThemeStore, THEMES, type ThemeType } from '../stores/themeStore';

export function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, setTheme } = useThemeStore();

  const handleThemeChange = (themeId: ThemeType) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  const currentThemeData = THEMES[currentTheme];

  return (
    <div className="relative">
      {/* Bouton principal - affiche le thème actuel */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-theme-surface/50 hover:bg-theme-secondary/50 rounded-lg transition-all duration-200 border border-theme-secondary/50 hover:border-theme-primary/50"
        title={`Current theme: ${currentThemeData.name}`}
        aria-label="Change theme"
      >
        {/* Indicateur du thème actuel */}
        <div
          className="w-6 h-6 rounded-full border-2 border-white/20 shadow-lg"
          style={{ backgroundColor: currentThemeData.accent }}
        />

        {/* Icône de chevron */}
        <svg
          className={`w-4 h-4 text-theme-text-secondary transition-transform duration-200 ml-1 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Menu déroulant des thèmes */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 p-3 bg-theme-surface/95 backdrop-blur-sm rounded-lg border border-theme-secondary/50 shadow-xl z-50 min-w-[200px]"
          >
            {/* En-tête */}
            <div className="mb-3 pb-2 border-b border-theme-secondary/50">
              <h3 className="text-sm font-semibold text-theme-text">Choose Theme</h3>
              <p className="text-xs text-theme-text-secondary">Customize your moodboard appearance</p>
            </div>

            {/* Grille des thèmes */}
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(THEMES).map(([themeId, theme]) => {
                const isActive = themeId === currentTheme;

                return (
                  <motion.button
                    key={themeId}
                    onClick={() => handleThemeChange(themeId as ThemeType)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative p-3 rounded-lg transition-all duration-200 border-2 ${
                      isActive
                        ? 'border-white/50 bg-theme-secondary/50'
                        : 'border-theme-secondary/30 hover:border-theme-primary/50 bg-theme-surface/30 hover:bg-theme-surface/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Bulle de couleur */}
                      <div
                        className={`w-8 h-8 rounded-full border-2 shadow-lg ${
                          isActive ? 'border-white/50' : 'border-theme-secondary/50'
                        }`}
                        style={{ backgroundColor: theme.accent }}
                      />

                      {/* Informations du thème */}
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium text-sm ${
                            isActive ? 'text-white' : 'text-theme-text'
                          }`}>
                            {theme.name}
                          </span>
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-green-400 rounded-full"
                            />
                          )}
                        </div>

                        {/* Aperçu des couleurs */}
                        <div className="flex gap-1 mt-1">
                          <div
                            className="w-3 h-3 rounded-full border border-theme-secondary"
                            style={{ backgroundColor: theme.primary }}
                          />
                          <div
                            className="w-3 h-3 rounded-full border border-theme-secondary"
                            style={{ backgroundColor: theme.secondary }}
                          />
                          <div
                            className="w-3 h-3 rounded-full border border-theme-secondary"
                            style={{ backgroundColor: theme.accent }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Footer avec info */}
            <div className="mt-3 pt-2 border-t border-theme-secondary/50">
              <p className="text-xs text-theme-text-secondary text-center">
                Theme preference saved automatically
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay pour fermer le menu en cliquant ailleurs */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
