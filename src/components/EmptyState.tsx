import { motion } from 'framer-motion';
import { useFilterStore } from '../stores/filterStore';
import { useMoodStore } from '../stores/moodStore';
import { useWorkStore } from '../stores/workStore';
import { useUIStore } from '../stores/uiStore';

interface EmptyStateProps {
  totalWorksCount?: number;
}

export function EmptyState({ totalWorksCount = 0 }: EmptyStateProps) {
  const { filters, activeSmartTags, resetAllFilters } = useFilterStore();
  const { todayMoodsData } = useMoodStore();
  const { works } = useWorkStore();
  const { toggleFilterMenu } = useUIStore();

  // Analyse du contexte pour déterminer le type d'état vide
  const getEmptyStateContext = () => {
    const hasActiveFilters =
      filters.status !== 'all' ||
      filters.category !== 'all' ||
      filters.isFavorite ||
      filters.searchQuery ||
      activeSmartTags.length > 0 ||
      todayMoodsData.moods.length > 0;

    const hasWorks = totalWorksCount > 0 || works.length > 0;

    if (hasWorks && hasActiveFilters) {
      return 'filtered';
    } else if (filters.searchQuery) {
      return 'search';
    } else if (hasActiveFilters) {
      return 'restrictive';
    } else {
      return 'genuine';
    }
  };

  const context = getEmptyStateContext();

  // Messages et actions selon le contexte
  const getContextualContent = () => {
    switch (context) {
      case 'filtered':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
          ),
          title: "No works match your current filters",
          description: "Try adjusting your filters or clearing them to see more works.",
          actions: [
            {
              label: "Clear All Filters",
              action: resetAllFilters,
              variant: "primary" as const,
            },
            {
              label: "Open Filters",
              action: toggleFilterMenu,
              variant: "secondary" as const,
            }
          ]
        };

      case 'search':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ),
          title: `No results for "${filters.searchQuery}"`,
          description: "Try different keywords or check your spelling.",
          actions: [
            {
              label: "Clear Search",
              action: () => useFilterStore.getState().setFilters({ searchQuery: '' }),
              variant: "primary" as const,
            },
            {
              label: "Open Filters",
              action: toggleFilterMenu,
              variant: "secondary" as const,
            }
          ]
        };

      case 'restrictive':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          title: "Your filters are too restrictive",
          description: "The combination of filters you've selected doesn't match any works.",
          actions: [
            {
              label: "Reset All Filters",
              action: resetAllFilters,
              variant: "primary" as const,
            },
            {
              label: "Adjust Filters",
              action: toggleFilterMenu,
              variant: "secondary" as const,
            }
          ]
        };

      default: // 'genuine'
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          ),
          title: "Your backlog is empty!",
          description: "Start building your collection by adding books, movies, games, or anything else you want to experience.",
          actions: [
            {
              label: "Add Your First Work",
              action: () => {
                // Scroll to AddWorkCard avec un délai pour laisser l'animation se terminer
                setTimeout(() => {
                  const addWorkCard = document.querySelector('.add-work-card') ||
                                     document.querySelector('[data-testid="add-work-card"]');
                  if (addWorkCard) {
                    addWorkCard.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center'
                    });
                    // Ajouter un highlight visuel
                    addWorkCard.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-50');
                    setTimeout(() => {
                      addWorkCard.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-50');
                    }, 2000);
                  }
                }, 300);
              },
              variant: "primary" as const,
            }
          ]
        };
    }
  };

  const content = getContextualContent();

  return (
             <div className="flex flex-col items-center mt-8 sm:mt-16 w-full max-w-sm sm:w-96 px-4">
      {/* EmptyState - Largeur réduite et centré */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center text-slate-400 flex-shrink-0 w-full"
      >
        {content.icon}

        <h3 className="text-xl font-semibold text-slate-300 mb-3">
          {content.title}
        </h3>

        <p className="text-slate-400 mb-6 leading-relaxed">
          {content.description}
        </p>

        {/* Actions contextuelles */}
        <div className="flex flex-wrap gap-3 justify-center">
          {content.actions.map((action, index) => (
                             <motion.button
                   key={index}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={action.action}
                   className={`px-4 py-3 sm:px-6 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                     action.variant === 'primary'
                       ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                       : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
                   }`}
                 >
              {action.label}
            </motion.button>
          ))}
        </div>

        {/* Informations contextuelles supplémentaires */}
        {context !== 'genuine' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700"
          >
            <p className="text-sm text-slate-400">
              <strong>Active filters:</strong> {
                [
                  filters.status !== 'all' && `Status: ${filters.status}`,
                  filters.category !== 'all' && `Category: ${filters.category}`,
                  filters.isFavorite && 'Favorites only',
                  filters.searchQuery && `Search: "${filters.searchQuery}"`,
                  activeSmartTags.length > 0 && `Smart Tags: ${activeSmartTags.join(', ')}`,
                  todayMoodsData.moods.length > 0 && 'Mood-based filtering'
                ].filter(Boolean).join(' • ')
              }
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
