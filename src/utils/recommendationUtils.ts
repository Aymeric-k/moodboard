import type { MoodType } from '../types/MoodType';
import type { WorkType } from '../types/WorkType';
import type { SmartTag } from '../types/SmartTag';
interface ScoreParams {
  work: WorkType;
  todayMoods: number[];
  activeSmartTags: SmartTag[];
  allMoods: MoodType[];
}

export interface Recommendation {
  score: number;
  breakdown: string[];
}

/**
 * Calculates a recommendation score for a given work based on various factors.
 * @param params - The parameters for score calculation.
 * @returns A numerical score. Higher is better.
 */
export function calculateRecommendationScore({ work, todayMoods, activeSmartTags, allMoods }: ScoreParams): Recommendation {
  // Don't recommend completed works
  if (work.status === 'completed') {
    return { score: -Infinity, breakdown: ['Completed works are not recommended.'] };
  }

  let score = 0;
  const breakdown: string[] = [];

  // +3 per common mood
    const commonMoods = work.moodId.filter(id => todayMoods.includes(id));
  if (commonMoods.length > 0) {
    score += commonMoods.length * 3;
    const moodLabels = commonMoods.map(id => allMoods.find(m => m.id === id)?.label).filter(Boolean);
    breakdown.push(`+${commonMoods.length * 3} for common moods: ${moodLabels.join(', ')}`);
  }
    // +4 per matching smart tag
  if (work.smartTags && activeSmartTags.length > 0) {
    const matchingTags = work.smartTags.filter(tag => activeSmartTags.includes(tag));
    if (matchingTags.length > 0) {
      score += matchingTags.length * 4;
      breakdown.push(`+${matchingTags.length * 4} for matching tags: ${matchingTags.join(', ')}`);
    }
  }

  // Duration-based scoring

  // +2 if favorite
  if (work.isFavorite) {
    score += 3;
    breakdown.push('+3 for being a favorite')
  }

  // -2 if re-suggested < 24h
  if (work.lastSuggestedAtISO) {
    const hoursSinceSuggested = (new Date().getTime() - new Date(work.lastSuggestedAtISO).getTime()) / (1000 * 60 * 60);
    if (hoursSinceSuggested < 24) {
      score -= 2;
      breakdown.push('-2 for recent suggestion');
    }
  }

  // +1 if never started, +2 if already started
  score += work.progress === 0 ? 1 : 2;

  return { score, breakdown };
}

