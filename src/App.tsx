import { moods } from './data/moods.ts'
// import type { MoodType } from './types/MoodType.ts';
// import type { WorkType } from './types/WorkType'
import './App.css'
import { calculateRecommendationScore, type Recommendation } from './utils/recommendationUtils.ts';
import { groupActivitiesByDay } from './utils/moodUtils.ts';
import Buttons from './components/Buttons'
import WorkCard from './components/WorkCard.tsx'
import ConfirmationModal from './components/ConfirmationModal.tsx'
import NotesModal from './components/NotesModal.tsx'
import AddWorkCard from './components/AddWorkCard.tsx'
import FilterControls from './components/FilterControls.tsx'
import { YearlyHeatmap } from './components/YearlyHeatmap.tsx'
import { useEffect, useMemo, useRef } from 'react';
import { EmptyState } from './components/EmptyState.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnClickOutside } from './hooks/useOnClickOutside.ts';
import { useWorkStore } from './stores/workStore.ts';
import { useFilterStore } from './stores/filterStore.ts';
import { useMoodStore } from './stores/moodStore.ts';
import { useUIStore } from './stores/uiStore.ts';
import SmartTagSelector from './components/SmartTagSelector.tsx';

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

  // Regroupe les événements d'humeur par jour pour la heatmap
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

  const recommendedWorks = useMemo(() => {
    if (todayMoods.length === 0 && activeSmartTags.length === 0) {
      return null;
    }

    const recommendations = new Map<string, Recommendation>();
    works.forEach(work => {
      // Only calculate scores for works that have at least one matching mood or tag
      const hasMoodMatch = work.moodId.some(id => todayMoods.includes(id));
      const hasTagMatch = work.smartTags?.some(tag => activeSmartTags.includes(tag));

      if (hasMoodMatch || hasTagMatch) {
        const recommendation = calculateRecommendationScore({ work, todayMoods, activeSmartTags, allMoods: moods });
        if (recommendation.score > -Infinity) {
          recommendations.set(work.id, recommendation);
        }
      }
    });
    return recommendations;
  }, [works, todayMoods, activeSmartTags]);

  const displayedWorks = useMemo(() => {
    let filteredWorks = [...works];

    // 1. Apply status, category, and favorite filters
    filteredWorks = filteredWorks.filter(work => {
      const statusMatch = filters.status === 'all' || work.status === filters.status;
      const categoryMatch = filters.category === 'all' || work.category === filters.category;
      const favoriteMatch = !filters.isFavorite || work.isFavorite;

      // 2. Apply search filter (case-insensitive)
      const searchMatch = !filters.searchQuery ||
        work.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        (work.notes && work.notes.toLowerCase().includes(filters.searchQuery.toLowerCase()));

      return statusMatch && categoryMatch && favoriteMatch && searchMatch;
    });

    // 2. If recommendations are active, sort by score. Otherwise, sort by creation date.
    if (recommendedWorks) {
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
    <div className={`min-h-screen bg-gradient-to-b from-slate-900 to-blue-950`}>
      <h1 className="text-3xl font-bold text-center pt-10 text-gray-100">How are you feeling today?</h1>
      <Buttons moods={moods} activeMoods={todayMoods} />

      {/* Smart Tag Toggles */}
      <div className="max-w-6xl mx-auto px-8 m-4">
        <SmartTagSelector
          activeTags={activeSmartTags}
          onTagToggle={toggleSmartTag}
          className="flex flex-wrap justify-center gap-2"
        />
      </div>


      {/* On affiche la nouvelle heatmap, plus discrète et alignée à droite */}
      <div className="flex justify-center px-8 mb-4">
        <YearlyHeatmap
          dailyData={dailyActivities}
          moods={moods}
        />
      </div>

      <h2 className="text-2xl font-bold text-center pt-6 text-gray-200">What do you want to do?</h2>

      {/* New Filter Bar and Button */}
      <div className="max-w-7xl mx-auto px-8 mt-4 mb-8">
        <div className="relative">
          <hr className="border-t-2 border-slate-700" />
          <div className="absolute top-3.5 right-0 flex justify-end">
            <button
              ref={filterButtonRef}
              onClick={toggleFilterMenu}
              className="flex items-center gap-2 px-4 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full text-sm text-slate-300 hover:bg-slate-700/80 hover:border-slate-600 transition-all"
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
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-full right-0 mt-2 z-30"
              >
                <FilterControls categories={[...new Set(works.map(w => w.category))]} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        key={todayMoods.join('-') + activeSmartTags.join('-')} // A key that changes when moods or tags change
        className='flex flex-wrap gap-8 justify-center p-8'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {displayedWorks.length > 0 ? (
          <AnimatePresence>
            {displayedWorks.map((work) => (
              <WorkCard
                key={work.id}
                backlogWork={work} // Renamed prop
                activeMoods={todayMoods}
                moods={moods}
                isPromptingForProgress={work.id === workToPromptForProgressId}
                recommendation={recommendedWorks?.get(work.id)}
              />
            ))}
          </AnimatePresence>
        ) : (
          <EmptyState />
        )}
        <AddWorkCard moods={moods} />
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
