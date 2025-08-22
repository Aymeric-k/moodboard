import { describe, it, expect } from 'vitest';
import { calculateRecommendationScore } from '../recommendationUtils';
import type { WorkType } from '../../types/WorkType';
import type { MoodType } from '../../types/MoodType';
import type { SmartTag } from '../../types/SmartTag';

describe('recommendationUtils', () => {
  const mockMoods: MoodType[] = [
    { id: 1, label: 'Happy', emoji: '😊', color: '#22c55e' },
    { id: 2, label: 'Relaxed', emoji: '😌', color: '#3b82f6' },
    { id: 3, label: 'Motivated', emoji: '💪', color: '#f59e0b' },
    { id: 4, label: 'Creative', emoji: '🎨', color: '#8b5cf6' },
  ];

  const mockWork: WorkType = {
    id: '1',
    title: 'Test Work',
    category: 'book',
    imageUrl: 'https://example.com/image.jpg',
    moodId: [1, 2], // Happy + Relaxed
    smartTags: ['quick', 'withFriend'],
    notes: 'Test notes',
    isFavorite: false,
    createdAtISO: new Date().toISOString(),
    status: 'backlog',
    progress: 0,
  };

  describe('calculateRecommendationScore', () => {
    it('should return high score for work matching current moods', () => {
      const todayMoods = [1, 2]; // Happy + Relaxed
      const activeSmartTags: SmartTag[] = ['quick'];

      const score = calculateRecommendationScore({
        work: mockWork,
        todayMoods,
        activeSmartTags,
        allMoods: mockMoods,
      });

      expect(score.score).toBeGreaterThan(0);
      expect(score.breakdown).toContain('+6 for common moods: Happy, Relaxed');
      expect(score.breakdown).toContain('+4 for matching tags: quick');
    });

    it('should return lower score for partial mood matches', () => {
      const todayMoods = [1]; // Only Happy
      const activeSmartTags: SmartTag[] = [];

      const score = calculateRecommendationScore({
        work: mockWork,
        todayMoods,
        activeSmartTags,
        allMoods: mockMoods,
      });

      expect(score.score).toBeGreaterThan(0);
      expect(score.breakdown).toContain('+3 for common moods: Happy');
      expect(score.breakdown).not.toContain('Relaxed');
    });

    it('should return score for smart tag matches without mood matches', () => {
      const todayMoods = [3]; // Motivated (not in work)
      const activeSmartTags: SmartTag[] = ['quick', 'withFriend'];

      const score = calculateRecommendationScore({
        work: mockWork,
        todayMoods,
        activeSmartTags,
        allMoods: mockMoods,
      });

      expect(score.score).toBeGreaterThan(0);
      expect(score.breakdown).toContain('+8 for matching tags: quick, withFriend');
      expect(score.breakdown).not.toContain('for common moods');
    });

    it('should return low score for no matches', () => {
      const todayMoods = [3]; // Motivated (not in work)
      const activeSmartTags: SmartTag[] = ['long']; // Not in work

      const score = calculateRecommendationScore({
        work: mockWork,
        todayMoods,
        activeSmartTags,
        allMoods: mockMoods,
      });

      // Score = 1 (base progress) + 0 (no matches) = 1
      expect(score.score).toBe(1);
      // La fonction ne génère pas de messages quand il n'y a pas de matches
      expect(score.breakdown).toHaveLength(0);
    });

    it('should handle empty arrays gracefully', () => {
      const todayMoods: number[] = [];
      const activeSmartTags: SmartTag[] = [];

      const score = calculateRecommendationScore({
        work: mockWork,
        todayMoods,
        activeSmartTags,
        allMoods: mockMoods,
      });

      // Score = 1 (base progress) + 0 (no matches) = 1
      expect(score.score).toBe(1);
      // La fonction ne génère pas de messages quand il n'y a pas de matches
      expect(score.breakdown).toHaveLength(0);
    });

    it('should prioritize mood matches over smart tags', () => {
      const todayMoods = [1, 2]; // Happy + Relaxed (perfect match)
      const activeSmartTags: SmartTag[] = ['long']; // No match

      const score = calculateRecommendationScore({
        work: mockWork,
        todayMoods,
        activeSmartTags,
        allMoods: mockMoods,
      });

      expect(score.score).toBeGreaterThan(0);
      expect(score.breakdown).toContain('+6 for common moods: Happy, Relaxed');
      // La fonction ne génère pas "+0 for matching tags" quand il n'y a pas de smart tags actifs
      expect(score.breakdown).not.toContain('+0 for matching tags');
    });

    it('should handle work with no smart tags', () => {
      const workWithoutTags: WorkType = {
        ...mockWork,
        smartTags: [],
      };

      const todayMoods = [1]; // Happy
      const activeSmartTags: SmartTag[] = ['quick'];

      const score = calculateRecommendationScore({
        work: workWithoutTags,
        todayMoods,
        activeSmartTags,
        allMoods: mockMoods,
      });

      expect(score.score).toBeGreaterThan(0);
      expect(score.breakdown).toContain('+3 for common moods: Happy');
      // La fonction ne génère pas "+0 for matching tags" quand le work n'a pas de smart tags
      expect(score.breakdown).not.toContain('+0 for matching tags');
    });

    it('should handle work with no moods', () => {
      const workWithoutMoods: WorkType = {
        ...mockWork,
        moodId: [],
      };

      const todayMoods = [1]; // Happy
      const activeSmartTags: SmartTag[] = ['quick'];

      const score = calculateRecommendationScore({
        work: workWithoutMoods,
        todayMoods,
        activeSmartTags,
        allMoods: mockMoods,
      });

      expect(score.score).toBeGreaterThan(0);
      expect(score.breakdown).toContain('+4 for matching tags: quick');
      // La fonction ne génère pas "+0 for common moods" quand le work n'a pas de moods
      expect(score.breakdown).not.toContain('+0 for common moods');
    });
  });
});
