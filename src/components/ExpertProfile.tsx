import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpertStore } from '../stores/expertStore';
import { useWorkStore } from '../stores/workStore';
import { useThemeStore } from '../stores/themeStore';

import {
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  StarIcon,
  BookOpenIcon,
  CalendarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

interface ExpertProfileProps {
  expertId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExpertProfile: React.FC<ExpertProfileProps> = ({
  expertId,
  isOpen,
  onClose
}) => {
  const { getExpertById, getPicksByExpert, trackAddToBacklog } = useExpertStore();
  const { addWork } = useWorkStore();
  const { getCurrentTheme } = useThemeStore();

  const currentTheme = getCurrentTheme();

  const expert = expertId ? getExpertById(expertId) : null;
  const expertPicks = expertId ? getPicksByExpert(expertId) : [];

  if (!expert) return null;

  const handleAddToBacklog = (pickId: string, pick: any) => {
      const newWork = {
    id: `expert-pick-${pickId}-${Date.now()}`,
    title: pick.title,
    author: pick.author || '',
    category: pick.category as any,
    imageUrl: '', // Placeholder for now
    moodId: [], // Empty array for now
    status: 'notStarted' as const,
    priority: 'high' as const,
    progress: 0,
    isFavorite: false,
    inCollection: false,
    tags: pick.tags || [],
    notes: `Expert pick by ${expert.name}: ${pick.shortWhy}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedTime: pick.estimatedTime,
    targetMoods: pick.targetMood || [],
    difficulty: pick.difficulty,
    source: 'expert-recommendation',
    expertId: expert.id,
    expertPickId: pick.id
  };

    addWork(newWork);
    trackAddToBacklog(pickId);
  };

  const handleSocialLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div key={i} className="relative">
        {i < Math.floor(rating) ? (
          <StarIconSolid className="w-4 h-4 text-yellow-400" />
        ) : i < rating ? (
          <div className="relative">
            <StarIcon className="w-4 h-4 text-slate-400" />
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${(rating - i) * 100}%` }}
            >
              <StarIconSolid className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
        ) : (
          <StarIcon className="w-4 h-4 text-slate-400" />
        )}
      </div>
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'book': return '📚';
      case 'movie': return '🎬';
      case 'series': return '📺';
      case 'game': return '🎮';
      case 'music': return '🎵';
      case 'podcast': return '🎧';
      default: return '📖';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long'
    }).format(date);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden"
           style={{ backgroundColor: currentTheme.surface }}
            onClick={(e) => e.stopPropagation()}
          >
                         {/* Header */}
             <div
               className="relative p-6"
               style={{
                 background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
               }}
             >
                               <button
                   onClick={onClose}
                   className="absolute top-4 right-4 p-2 rounded-full transition-colors"
                   style={{
                     backgroundColor: `${currentTheme.secondary}80`,
                     color: currentTheme.textSecondary
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.backgroundColor = currentTheme.secondary;
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.backgroundColor = `${currentTheme.secondary}80`;
                   }}
                 >
                   <XMarkIcon className="w-5 h-5" />
                 </button>

              {/* Responsive Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-slate-500/50">
                    <img
                      src={expert.photoUrl}
                      alt={expert.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h1
                    className="text-2xl sm:text-3xl font-bold mb-2"
                    style={{ color: currentTheme.text }}
                  >
                    {expert.name}
                  </h1>
                  <p
                    className="text-lg sm:text-xl mb-3"
                    style={{ color: currentTheme.textSecondary }}
                  >
                    {expert.specialty}
                  </p>

                  {/* Responsive Stats */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-6 mb-4">
                    {expert.averageRating && (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {renderStars(expert.averageRating)}
                        </div>
                        <span
                          className="text-sm"
                          style={{ color: currentTheme.textSecondary }}
                        >
                          {expert.averageRating.toFixed(1)}
                        </span>
                      </div>
                    )}

                    <div
                      className="flex items-center gap-2"
                      style={{ color: currentTheme.textSecondary }}
                    >
                      <BookOpenIcon className="w-4 h-4" />
                      <span className="text-sm">{expertPicks.length} recommendations</span>
                    </div>

                    <div
                      className="flex items-center gap-2"
                      style={{ color: currentTheme.textSecondary }}
                    >
                       <CalendarIcon className="w-4 h-4" />
                       <span className="text-sm">Since {formatDate(expert.joinedAt)}</span>
                     </div>
                  </div>

                  {/* Responsive Social Links */}
                  {expert.socialLinks && (
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
                      {expert.socialLinks.instagram && (
                        <button
                          onClick={() => handleSocialLink(`https://instagram.com/${expert.socialLinks!.instagram}`)}
                          className="px-3 py-2 bg-pink-600/20 text-pink-300 rounded-lg text-xs sm:text-sm hover:bg-pink-600/30 transition-colors flex items-center gap-2"
                        >
                          📷 <span className="hidden sm:inline">Instagram</span>
                          <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                        </button>
                      )}
                      {expert.socialLinks.goodreads && (
                        <button
                          onClick={() => handleSocialLink(`https://goodreads.com/user/show/${expert.socialLinks!.goodreads}`)}
                          className="px-3 py-2 bg-amber-600/20 text-amber-300 rounded-lg text-xs sm:text-sm hover:bg-amber-600/30 transition-colors flex items-center gap-2"
                        >
                          📖 <span className="hidden sm:inline">Goodreads</span>
                          <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                        </button>
                      )}
                      {expert.socialLinks.website && (
                        <button
                          onClick={() => handleSocialLink(expert.socialLinks!.website!)}
                          className="px-3 py-2 bg-blue-600/20 text-blue-300 rounded-lg text-xs sm:text-sm hover:bg-blue-600/30 transition-colors flex items-center gap-2"
                        >
                          🌐 <span className="hidden sm:inline">Website</span>
                          <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Bio */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">About</h2>
                <p className="text-slate-300 leading-relaxed">
                  {expert.bio}
                </p>
              </div>

              {/* Expertise */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Specialties</h2>
                <div className="flex flex-wrap gap-2">
                  {expert.expertise.map((category) => (
                    <span
                      key={category}
                      className="px-3 py-2 bg-slate-700/50 text-slate-300 rounded-lg text-sm flex items-center gap-2"
                    >
                      {getCategoryIcon(category)}
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reading History */}
              <div>
                <h2
                  className="text-xl font-semibold mb-6"
                  style={{ color: currentTheme.text }}
                >
                  📚 Reading History ({expertPicks.length})
                </h2>

                <div className="space-y-4">
                  {expertPicks
                    .sort((a, b) => new Date(b.weekOf).getTime() - new Date(a.weekOf).getTime())
                    .map((pick) => (
                    <motion.div
                      key={pick.id}
                      className="p-4 rounded-xl border transition-colors"
                      style={{
                        backgroundColor: `${currentTheme.secondary}10`,
                        borderColor: `${currentTheme.secondary}30`
                      }}
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex-1 w-full">
                          {/* Header avec date */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {getCategoryIcon(pick.category)}
                              </span>
                              <h3
                                className="font-semibold text-base sm:text-lg"
                                style={{ color: currentTheme.text }}
                              >
                                {pick.title}
                              </h3>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {pick.isPickOfTheWeek && (
                                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                                  📅 Pick of the Week
                                </span>
                              )}
                              <span
                                className="px-2 py-1 text-xs rounded-full"
                                style={{
                                  backgroundColor: `${currentTheme.primary}30`,
                                  color: currentTheme.textSecondary
                                }}
                              >
                                                                {new Date(pick.weekOf).toLocaleDateString('en-US', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Author and description */}
                          {pick.author && (
                            <p
                              className="text-sm mb-2"
                              style={{ color: currentTheme.textSecondary }}
                            >
                              by {pick.author}
                            </p>
                          )}

                          <p
                            className="text-sm italic mb-3"
                            style={{ color: currentTheme.text }}
                          >
                            "{pick.shortWhy}"
                          </p>

                          <p
                            className="text-sm leading-relaxed mb-4"
                            style={{ color: currentTheme.textSecondary }}
                          >
                            {pick.fullDescription}
                          </p>

                          {/* Tags and metadata */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {pick.estimatedTime && (
                              <span
                                className="px-2 py-1 text-xs rounded"
                                style={{
                                  backgroundColor: `${currentTheme.secondary}30`,
                                  color: currentTheme.textSecondary
                                }}
                              >
                                ⏱️ {pick.estimatedTime}
                              </span>
                            )}
                            {pick.difficulty && (
                              <span className={`px-2 py-1 text-xs rounded ${
                                pick.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                                pick.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-red-500/20 text-red-300'
                              }`}>
                                {pick.difficulty === 'easy' ? '🟢' : pick.difficulty === 'medium' ? '🟡' : '🔴'} {pick.difficulty}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <motion.button
                            onClick={() => handleAddToBacklog(pick.id, pick)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <PlusIcon className="w-4 h-4" />
                            Add
                          </motion.button>

                          {pick.amazonLink && (
                            <motion.button
                              onClick={() => window.open(pick.amazonLink, '_blank')}
                              className="flex items-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                                                         >
                               <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                               Buy
                             </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(ExpertProfile);
