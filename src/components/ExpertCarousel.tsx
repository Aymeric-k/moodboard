import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpertStore } from '../stores/expertStore';
import { useThemeStore } from '../stores/themeStore';
import ExpertCarouselCard from './ExpertCarouselCard';
import { ExpertProfile } from './ExpertProfile';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ExpertCarouselProps {
  className?: string;
}

export const ExpertCarousel: React.FC<ExpertCarouselProps> = ({ className = '' }) => {
  const {
    getCurrentPickOfTheWeek,
    getPreviousPicks,
    getExpertById,
    carousel,
    nextPick,
    previousPick,
    pauseRotation,
    resumeRotation,
    trackView
  } = useExpertStore();

  const { getCurrentTheme } = useThemeStore();

  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
  const rotationIntervalRef = useRef<number | null>(null);

  const currentTheme = getCurrentTheme();
  const currentPickOfTheWeek = getCurrentPickOfTheWeek();
  const previousPicks = getPreviousPicks(5); // 5 picks précédents
  const currentPick = currentPickOfTheWeek || previousPicks[carousel.currentIndex] || previousPicks[0];
  const currentExpert = currentPick ? getExpertById(currentPick.expertId) : null;

  // Debug logging
  console.log('🔍 ExpertCarousel Debug:', {
    currentPickOfTheWeek: currentPickOfTheWeek?.title || 'None',
    previousPicksCount: previousPicks.length,
    currentPickIndex: carousel.currentIndex,
    currentPick: currentPick?.title || 'None',
    currentExpert: currentExpert?.name || 'None',
    expertsCount: useExpertStore.getState().experts.length,
    picksCount: useExpertStore.getState().expertPicks.length
  });

  // Auto-rotation logic
  useEffect(() => {
    const totalPicks = (currentPickOfTheWeek ? 1 : 0) + previousPicks.length;
    if (totalPicks <= 1 || carousel.isPaused || isHovered) {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
        rotationIntervalRef.current = null;
      }
      return;
    }

    rotationIntervalRef.current = setInterval(() => {
      nextPick();
    }, carousel.rotationInterval);

    return () => {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
      }
    };
  }, [currentPickOfTheWeek, previousPicks.length, carousel.isPaused, isHovered, carousel.rotationInterval, nextPick]);

  // Track views when pick changes
  useEffect(() => {
    if (currentPick) {
      trackView(currentPick.id);
    }
  }, [currentPick?.id, trackView]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    pauseRotation();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    resumeRotation();
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    previousPick();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    nextPick();
  };





  const handleExpertClick = () => {
    if (currentExpert) {
      setSelectedExpertId(currentExpert.id);
    }
  };

  const closeExpertProfile = () => {
    setSelectedExpertId(null);
  };

  // Don't render if no picks available
  if ((!currentPickOfTheWeek && previousPicks.length === 0) || !currentPick || !currentExpert) {
    return null;
  }

  return (
    <>
      {/* Desktop Version - Fixed top-left */}
      <div className="hidden md:block">
        <motion.div
          className={`fixed top-6 left-6 z-50 ${className}`}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
        <div className="relative">

        <AnimatePresence mode="wait">
          {/* Full Carousel */}
          <motion.div
            key="carousel"
            initial={{ scale: 0.3, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0.7 }}
            transition={{ duration: 0.3 }}
            className="w-80 min-h-[160px] backdrop-blur-sm rounded-xl border overflow-hidden shadow-xl flex flex-col"
            style={{
              backgroundColor: `${currentTheme.surface}E6`, // 90% opacity
              borderColor: `${currentTheme.secondary}80`
            }}
          >
                               {/* Navigation Arrows - Only show if multiple picks */}
                {((currentPickOfTheWeek && previousPicks.length > 0) || previousPicks.length > 1) && (
                  <>
                    <button
                      onClick={handlePrevious}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-slate-700/80 hover:bg-slate-600/80 rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-sm opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeftIcon className="w-4 h-4 text-slate-300" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-slate-700/80 hover:bg-slate-600/80 rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-sm opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRightIcon className="w-4 h-4 text-slate-300" />
                    </button>
                  </>
                )}

               {/* Carousel Content - Takes remaining space */}
               <div className="group flex-1">
                 <AnimatePresence mode="wait">
                   <motion.div
                     key={currentPick.id}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.3 }}
                   >
                                           <ExpertCarouselCard
                        pick={currentPick}
                        expert={currentExpert}
                        onExpertClick={handleExpertClick}
                      />
                   </motion.div>
                 </AnimatePresence>
               </div>
          </motion.div>
        </AnimatePresence>
      </div>
      </motion.div>
      </div>

      {/* Mobile Version - Bottom sheet */}
      <div className="block md:hidden">
                {/* Floating Action Button */}
        <motion.button
          onClick={() => setIsMobileOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl shadow-lg flex items-center justify-center transition-colors"
          style={{
            backgroundColor: currentTheme.primary,
            color: currentTheme.text
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = currentTheme.secondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = currentTheme.primary;
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Expert's Pick"
        >
          <span className="text-sm font-medium whitespace-nowrap">Expert's Pick</span>
        </motion.button>

        {/* Mobile Bottom Sheet */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileOpen(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-6 max-h-[80vh] overflow-hidden"
                style={{ backgroundColor: currentTheme.surface }}
                onClick={(e) => e.stopPropagation()}
              >
                                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-500/50">
                      <img
                        src={currentExpert.photoUrl}
                        alt={currentExpert.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold" style={{ color: currentTheme.text }}>
                        {currentExpert.name}
                      </h2>
                      <p className="text-sm" style={{ color: currentTheme.textSecondary }}>
                        {currentExpert.specialty}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 transition-colors"
                    style={{ color: currentTheme.textSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = currentTheme.text;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = currentTheme.textSecondary;
                    }}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Current Pick of the Week */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      Pick of the Week
                    </span>
                    <span className="text-xs" style={{ color: currentTheme.textSecondary }}>
                      {new Date(currentPick.weekOf).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2" style={{ color: currentTheme.text }}>
                    {currentPick.title}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: currentTheme.textSecondary }}>
                    by {currentPick.author}
                  </p>

                  <p className="text-sm italic mb-4" style={{ color: currentTheme.text }}>
                    "{currentPick.shortWhy}"
                  </p>

                  <p className="text-sm leading-relaxed mb-4" style={{ color: currentTheme.textSecondary }}>
                    {currentPick.fullDescription}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentPick.tags?.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: `${currentTheme.secondary}30`,
                          color: currentTheme.text
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={() => {
                        // Add to backlog logic
                        setIsMobileOpen(false);
                      }}
                      className="flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                      style={{
                        backgroundColor: currentTheme.primary,
                        color: currentTheme.text
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = currentTheme.secondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = currentTheme.primary;
                      }}
                    >
                      📚 Add to Backlog
                    </button>
                    {currentPick.amazonLink && (
                      <button
                        onClick={() => window.open(currentPick.amazonLink, '_blank')}
                        className="px-4 py-3 text-sm font-medium rounded-lg transition-colors border"
                        style={{
                          backgroundColor: 'transparent',
                          borderColor: currentTheme.secondary,
                          color: currentTheme.text
                        }}
                      >
                        🛒 Amazon
                      </button>
                    )}
                  </div>
                </div>

                {/* Previous Picks Button */}
                <button
                  onClick={() => {
                    setSelectedExpertId(currentExpert.id);
                    setIsMobileOpen(false);
                  }}
                  className="w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors border"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: currentTheme.secondary,
                    color: currentTheme.text
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${currentTheme.secondary}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  📚 Reading History with {currentExpert.name}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

                   {/* Expert Profile Modal - Shared between desktop and mobile */}
      <ExpertProfile
        expertId={selectedExpertId}
        isOpen={selectedExpertId !== null}
        onClose={closeExpertProfile}
      />
    </>
  );
};

export default React.memo(ExpertCarousel);
