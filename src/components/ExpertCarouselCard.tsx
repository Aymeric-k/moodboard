import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useExpertStore } from '../stores/expertStore';
import { useWorkStore } from '../stores/workStore';
import type { Expert } from '../types/ExpertType';
import type { ExpertPick } from '../types/ExpertPick';
import { PlusIcon, ArrowTopRightOnSquareIcon, UserIcon } from '@heroicons/react/24/outline';

interface ExpertCarouselCardProps {
  pick: ExpertPick;
  expert: Expert;
  onExpertClick?: () => void;
}

export const ExpertCarouselCard: React.FC<ExpertCarouselCardProps> = ({
  pick,
  expert,
  onExpertClick
}) => {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [hoverStartTime, setHoverStartTime] = useState<number | null>(null);
  const { trackHover, trackClick, trackAddToBacklog, trackAmazonClick } = useExpertStore();
  const { addWork } = useWorkStore();

  const hoverTimeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    setIsCardHovered(true);
    setHoverStartTime(Date.now());

    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsCardHovered(false);

    // Track hover time if we have a start time
    if (hoverStartTime) {
      const hoverTime = Date.now() - hoverStartTime;
      trackHover(pick.id, hoverTime);
      setHoverStartTime(null);
    }
  };

  const handleCardClick = () => {
    trackClick(pick.id);
    if (onExpertClick) {
      onExpertClick();
    }
  };

  const handleAddToBacklog = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Create a work item from the expert pick
    const newWork = {
      id: `expert-pick-${pick.id}-${Date.now()}`,
      title: pick.title,
      author: pick.author || '',
      category: pick.category as any, // Type assertion for now
      imageUrl: '', // Placeholder for now
      moodId: [], // Empty array for now
      status: 'notStarted' as const,
      priority: 'high' as const, // Expert picks get high priority
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
    trackAddToBacklog(pick.id);

    // Visual feedback
    // TODO: Add toast notification
  };

  const handleAmazonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pick.amazonLink) {
      trackAmazonClick(pick.id);
      window.open(pick.amazonLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleExpertClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onExpertClick) {
      onExpertClick();
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'book': return 'text-blue-400';
      case 'movie': return 'text-purple-400';
      case 'series': return 'text-green-400';
      case 'game': return 'text-red-400';
      case 'music': return 'text-yellow-400';
      case 'podcast': return 'text-pink-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <motion.div
      className="relative cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      layout
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div
        className="p-4"
        animate={{
          height: isCardHovered ? 'auto' : '130px'
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header - Expert Info */}
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            className="relative cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={handleExpertClick}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-500/50">
              <img
                src={expert.photoUrl}
                alt={expert.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm truncate">
              {expert.name}
            </h3>
            <p className="text-slate-400 text-xs truncate">
              {expert.specialty}
            </p>
          </div>

          <div className={`text-lg ${getCategoryColor(pick.category)}`}>
            {getCategoryIcon(pick.category)}
          </div>
        </div>

        {/* Pick Title */}
        <div className="mb-2">
          <h4 className="font-medium text-white text-sm leading-tight">
            {isCardHovered ? pick.title : truncateText(pick.title, 40)}
          </h4>
          {pick.author && (
            <p className="text-slate-400 text-xs mt-1">
              by {pick.author}
            </p>
          )}
        </div>

        {/* Short Why */}
        <p className="text-slate-300 text-xs italic mb-3">
          "{isCardHovered ? pick.shortWhy : truncateText(pick.shortWhy, 60)}"
        </p>

        {/* Expanded Content - Only show on hover */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isCardHovered ? 1 : 0,
            height: isCardHovered ? 'auto' : 0
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="overflow-hidden"
        >
          {/* Full Description */}
          <div className="mb-4 p-3 bg-slate-700/30 rounded-lg border-l-2 border-blue-400/50">
            <p className="text-slate-200 text-sm leading-relaxed">
              {pick.fullDescription}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-2 mb-4">
            {pick.estimatedTime && (
              <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
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
            {pick.targetMood && pick.targetMood.length > 0 && (
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                🎭 {pick.targetMood.join(', ')}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <motion.button
              onClick={handleAddToBacklog}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PlusIcon className="w-4 h-4" />
              Add to Backlog
            </motion.button>

            {pick.amazonLink && (
              <motion.button
                onClick={handleAmazonClick}
                className="px-3 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title="View on Amazon"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </motion.button>
            )}

            <motion.button
              onClick={handleExpertClick}
              className="px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title="View Expert Profile"
            >
              <UserIcon className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(ExpertCarouselCard);
