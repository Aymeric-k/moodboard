import { moods } from './data/moods.ts'
// import type { MoodType } from './types/MoodType.ts';
// import type { WorkType } from './types/WorkType'
import './App.css'
import './styles/themes.css'
import { calculateRecommendationScore, type Recommendation } from './utils/recommendationUtils.ts';
import { groupActivitiesByDay } from './utils/moodUtils.ts';
import Buttons from './components/Buttons'
import WorkCard from './components/WorkCard.tsx'
import ConfirmationModal from './components/ConfirmationModal.tsx'
import NotesModal from './components/NotesModal.tsx'
import AddWorkCard from './components/AddWorkCard.tsx'
import FilterControls from './components/FilterControls.tsx'
import { YearlyHeatmap } from './components/YearlyHeatmap.tsx'
import { ThemeSelector } from './components/ThemeSelector.tsx'
import { useEffect, useMemo, useRef, useState } from 'react';
import { EmptyState } from './components/EmptyState.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnClickOutside } from './hooks/useOnClickOutside.ts';
import { useWorkStore } from './stores/workStore.ts';
import { useFilterStore } from './stores/filterStore.ts';
import { useMoodStore } from './stores/moodStore.ts';
import { useUIStore } from './stores/uiStore.ts';
import SmartTagSelector from './components/SmartTagSelector.tsx';
import PerformanceProfiler from './components/PerformanceProfiler.tsx';

function App() {
  // Refs for the filter menu and its toggle button
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // Get state and actions from the Zustand store
  const { works, progressEvents } = useWorkStore()
  const { filters, activeSmartTags, toggleSmartTag } = useFilterStore();
  const { historicalEvents, todayMoodsData, commitMoodsIfNewDay } = useMoodStore();
  const {
    workToPromptForProgressId,
    setWorkToPromptForProgress,
    isFilterMenuOpen,
    toggleFilterMenu,
    closeFilterMenu
  } = useUIStore();

  // Detect mobile screen size
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const todayMoods = todayMoodsData.moods;

  // Hook to close the filter menu when clicking outside
  useOnClickOutside(filterMenuRef, closeFilterMenu, filterButtonRef);

  // This effect runs once on startup.
  // It handles committing moods from a previous day and checking for in-progress work.
  useEffect(() => {
    // The mood store now handles the logic for committing moods if the day has changed.
    commitMoodsIfNewDay();

    // On app load, check if there's a work we need to ask progress for.
    const lastInteractedWorkId = localStorage.getItem('moodboard-last-interacted-work-id');
    if (lastInteractedWorkId) {
      setWorkToPromptForProgress(lastInteractedWorkId);
    }
  }, [commitMoodsIfNewDay, setWorkToPromptForProgress]); // The dependency is stable, so this still runs only once.

  // Optimized daily activities calculation
  const dailyActivities = useMemo(() => {
    // 1. On traite l'historique permanent des humeurs et des œuvres.
    const data = groupActivitiesByDay(historicalEvents, works, progressEvents);

    // 2. On ajoute les données "live" d'aujourd'hui par-dessus.
    if (todayMoods.length > 0) {
      const todayISO = new Intl.DateTimeFormat('fr-CA').format(new Date());
      const moodCounts = new Map<number, number>();
      for (const id of todayMoods) {
        moodCounts.set(id, (moodCounts.get(id) || 0) + 1);
      }
      const dominantMoodId = [...moodCounts.entries()].reduce((a, b) => (b[1] > a[1] ? b : a))[0];

      // On met à jour ou on crée l'entrée du jour avec les humeurs live.
      const todayData = data.get(todayISO) || {
        dateISO: todayISO,
        moods: { count: 0, uniqueMoodIds: [], dominantMoodId: null },
        works: { added: 0, completed: 0, progressed: 0 },
      };

      todayData.moods = {
        count: todayMoods.length,
        uniqueMoodIds: todayMoods,
        dominantMoodId,
      };

      data.set(todayISO, todayData);
    }

    return data;
  }, [historicalEvents, todayMoods, works, progressEvents]);

  // Optimized recommendations calculation with early return
  const recommendedWorks = useMemo(() => {
    if (todayMoods.length === 0 && activeSmartTags.length === 0) {
      return null;
    }

    const recommendations = new Map<string, Recommendation>();
    const todayMoodsSet = new Set(todayMoods);
    const activeSmartTagsSet = new Set(activeSmartTags);

    works.forEach(work => {
      // Only calculate scores for works that have at least one matching mood or tag
      const hasMoodMatch = work.moodId.some(id => todayMoodsSet.has(id));
      const hasTagMatch = work.smartTags?.some(tag => activeSmartTagsSet.has(tag));

      if (hasMoodMatch || hasTagMatch) {
        const recommendation = calculateRecommendationScore({ work, todayMoods, activeSmartTags, allMoods: moods });
        if (recommendation.score > -Infinity) {
          recommendations.set(work.id, recommendation);
        }
      }
    });
    return recommendations;
  }, [works, todayMoods, activeSmartTags, moods]);

  // Optimized displayed works with memoized filters
  const displayedWorks = useMemo(() => {
    let filteredWorks = [...works];

    // 1. Apply status, category, and favorite filters
    filteredWorks = filteredWorks.filter(work => {
      const statusMatch = filters.status === 'all' || work.status === filters.status;
      const categoryMatch = filters.category === 'all' || work.category === filters.category;
      const favoriteMatch = !filters.isFavorite || work.isFavorite;

      // 2. Apply search filter (case-insensitive) - only if search query exists
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        const titleMatch = work.title.toLowerCase().includes(searchLower);
        const notesMatch = work.notes && work.notes.toLowerCase().includes(searchLower);
        if (!titleMatch && !notesMatch) return false;
      }

      return statusMatch && categoryMatch && favoriteMatch;
    });

    // 2. If recommendations are active, sort by score. Otherwise, sort by creation date.
    if (recommendedWorks && recommendedWorks.size > 0) {
      filteredWorks.sort((a, b) => {
        const scoreA = recommendedWorks.get(a.id)?.score ?? -Infinity;
        const scoreB = recommendedWorks.get(b.id)?.score ?? -Infinity;
        return scoreB - scoreA; // Sort descending by score
      });
    } else {
      // Default sort: by creation date
      filteredWorks.sort((a, b) => new Date(b.createdAtISO).getTime() - new Date(a.createdAtISO).getTime());
    }

    return filteredWorks;
  }, [works, filters, recommendedWorks]);

  // Memoized categories to prevent unnecessary recalculations
  const uniqueCategories = useMemo(() => [...new Set(works.map(w => w.category))], [works]);

  // Memoized container key to prevent unnecessary re-renders
  const containerKey = useMemo(() =>
    todayMoods.join('-') + activeSmartTags.join('-'),
    [todayMoods, activeSmartTags]
  );

  // Variants pour le conteneur qui va orchestrer l'animation
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {

        staggerChildren: 0.15,
      },
    },
  };

  return (
    <div id="app-root" className="min-h-screen">
      <h1 className="text-3xl font-bold text-center pt-10 text-theme-text px-4 sm:text-2xl sm:pt-6">How are you feeling today?</h1>

      {/* Theme Selector - Positionné en haut à droite */}
      <div className="fixed top-0 right-2 z-50 flex justify-center items-center">
        <ThemeSelector />
      </div>

      <Buttons moods={moods} activeMoods={todayMoods} />

      {/* Smart Tag Toggles */}
      <div className="max-w-6xl mx-auto px-8 m-4">
        <SmartTagSelector
          activeTags={activeSmartTags}
          onTagToggle={toggleSmartTag}
          className="flex flex-wrap justify-center gap-2"
        />
      </div>

      {/* New Filter Bar and Button */}
      <div className="max-w-7xl mx-auto px-8 mt-4 mb-8 sm:px-4 sm:mb-6">
        <div className="relative">
          <hr className="border-t-2 border-theme-secondary" />
        </div>
      </div>

      {/* On affiche la nouvelle heatmap, plus discrète et alignée à droite */}
      <div className="flex justify-center px-8 mb-4 overflow-x-hidden sm:px-4">
        <YearlyHeatmap
          dailyData={dailyActivities}
          moods={moods}
        />
      </div>

      <h2 className="text-2xl font-bold text-center pt-6 text-theme-text px-4 sm:text-xl sm:pt-4">What do you want to do?</h2>

      <motion.div
        key={containerKey} // A key that changes when moods or tags change
        className='relative flex flex-wrap justify-center gap-8 p-4 max-w-7xl mx-auto'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Filter Button - Positionné en haut à droite du container des WorkCards */}
        <div className="absolute -top-6 right-4 z-20">
          <button
            ref={filterButtonRef}
            onClick={toggleFilterMenu}
            className="flex items-center gap-2 px-4 py-1.5 bg-theme-surface/50 border border-theme-secondary rounded-full text-sm text-theme-text hover:bg-theme-secondary/80 hover:border-theme-primary transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 12.414V17a1 1 0 01-1.447.894l-2-1A1 1 0 018 16v-3.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            <span>Filter</span>
          </button>
        </div>

        <AnimatePresence>
          {isFilterMenuOpen && (
            <motion.div
              ref={filterMenuRef}
              initial={isMobile ? { opacity: 0, x: '100%' } : { opacity: 0, y: -10 }}
              animate={isMobile ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }}
              exit={isMobile ? { opacity: 0, x: '100%' } : { opacity: 0, y: -10, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={isMobile
                ? "fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center"
                : "absolute top-12 right-8 z-30"
              }
            >
              {isMobile && (
                <motion.button
                  onClick={closeFilterMenu}
                  className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
              <FilterControls categories={uniqueCategories} />
            </motion.div>
          )}
        </AnimatePresence>

        <PerformanceProfiler id="work-cards-container">
          {displayedWorks.length > 0 ? (
            <AnimatePresence>
              {displayedWorks.map((work) => (
                <PerformanceProfiler key={work.id} id={`work-card-${work.id}`}>
                  <WorkCard
                    backlogWork={work} // Renamed prop
                    activeMoods={todayMoods}
                    moods={moods}
                    isPromptingForProgress={work.id === workToPromptForProgressId}
                    recommendation={recommendedWorks?.get(work.id)}
                  />
                </PerformanceProfiler>
              ))}
            </AnimatePresence>
          ) : (
            <EmptyState totalWorksCount={works.length} />
          )}
          <PerformanceProfiler id="add-work-card">
            <AddWorkCard moods={moods} />
          </PerformanceProfiler>
        </PerformanceProfiler>
      </motion.div>

      <AnimatePresence>
        {/* The modal now controls its own visibility based on the uiStore */}
        <ConfirmationModal />
        <NotesModal />
      </AnimatePresence>
    </div>
  )
}

export default App
