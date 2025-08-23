import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useExpertStore } from '../expertStore';
import type { Expert } from '../../types/ExpertType';
import type { ExpertPick } from '../../types/ExpertPick';

describe('expertStore', () => {
  beforeEach(() => {
    // Reset le store avant chaque test
    useExpertStore.setState({
      experts: [],
      expertPicks: [],
    });
  });

  describe('addExpert', () => {
    it('should add a new expert to the store', () => {
      const { addExpert } = useExpertStore.getState();

      const newExpert: Expert = {
        id: 'test-expert',
        name: 'Test Expert',
        bio: 'Test bio',
        specialty: 'Literature & Fiction',
        photoUrl: 'https://example.com/photo.jpg',
        expertise: ['book'],
        isActive: true,
        joinedAt: new Date('2024-01-01'),
        totalPicks: 0,
        averageRating: 4.5,
      };

      addExpert(newExpert);

      const { experts } = useExpertStore.getState();
      expect(experts).toHaveLength(1);
      expect(experts[0]).toEqual(newExpert);
    });
  });

  describe('addExpertPick', () => {
    it('should add a new expert pick to the store', () => {
      const { addExpert, addExpertPick } = useExpertStore.getState();

      // D'abord ajouter un expert
      const expert: Expert = {
        id: 'test-expert',
        name: 'Test Expert',
        bio: 'Test bio',
        specialty: 'Literature & Fiction',
        photoUrl: 'https://example.com/photo.jpg',
        expertise: ['book'],
        isActive: true,
        joinedAt: new Date('2024-01-01'),
        totalPicks: 0,
      };

      addExpert(expert);

      const newPick: ExpertPick = {
        id: 'test-pick',
        expertId: 'test-expert',
        title: 'Test Book',
        author: 'Test Author',
        category: 'book',
        shortWhy: 'Great book!',
        fullDescription: 'This is a fantastic book that everyone should read.',
        featured: true,
        isPickOfTheWeek: true,
        weekOf: new Date('2024-12-02'),
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-01'),
        tags: ['fiction', 'contemporary'],
        estimatedTime: '300 pages',
        targetMood: ['Curious'],
        difficulty: 'medium',
        isActive: true,
      };

      addExpertPick(newPick);

      const { expertPicks, experts } = useExpertStore.getState();
      expect(expertPicks).toHaveLength(1);
      expect(expertPicks[0]).toEqual(newPick);

      // Vérifier que le totalPicks de l'expert a été mis à jour
      expect(experts[0].totalPicks).toBe(1);
    });
  });

  describe('getCurrentPickOfTheWeek', () => {
    it('should return the current pick of the week', () => {
      const { addExpert, addExpertPick, getCurrentPickOfTheWeek } = useExpertStore.getState();

      // Ajouter un expert
      const expert: Expert = {
        id: 'test-expert',
        name: 'Test Expert',
        bio: 'Test bio',
        specialty: 'Literature & Fiction',
        photoUrl: 'https://example.com/photo.jpg',
        expertise: ['book'],
        isActive: true,
        joinedAt: new Date('2024-01-01'),
        totalPicks: 0,
      };

      addExpert(expert);

      // Ajouter des picks
      const currentPick: ExpertPick = {
        id: 'current-pick',
        expertId: 'test-expert',
        title: 'Current Book',
        author: 'Current Author',
        category: 'book',
        shortWhy: 'Current pick!',
        fullDescription: 'This is the current pick of the week.',
        featured: true,
        isPickOfTheWeek: true,
        weekOf: new Date('2024-12-02'),
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-01'),
        tags: ['fiction'],
        isActive: true,
      };

      const oldPick: ExpertPick = {
        id: 'old-pick',
        expertId: 'test-expert',
        title: 'Old Book',
        author: 'Old Author',
        category: 'book',
        shortWhy: 'Old pick',
        fullDescription: 'This is an old pick.',
        featured: false,
        isPickOfTheWeek: false,
        weekOf: new Date('2024-11-25'),
        createdAt: new Date('2024-11-24'),
        updatedAt: new Date('2024-11-24'),
        tags: ['fiction'],
        isActive: true,
      };

      addExpertPick(currentPick);
      addExpertPick(oldPick);

      const result = getCurrentPickOfTheWeek();
      expect(result).toEqual(currentPick);
    });

    it('should return null when no current pick exists', () => {
      const { getCurrentPickOfTheWeek } = useExpertStore.getState();
      const result = getCurrentPickOfTheWeek();
      expect(result).toBeUndefined();
    });
  });

  describe('getPreviousPicks', () => {
    it('should return previous picks sorted by date', () => {
      const { addExpert, addExpertPick, getPreviousPicks } = useExpertStore.getState();

      // Ajouter un expert
      const expert: Expert = {
        id: 'test-expert',
        name: 'Test Expert',
        bio: 'Test bio',
        specialty: 'Literature & Fiction',
        photoUrl: 'https://example.com/photo.jpg',
        expertise: ['book'],
        isActive: true,
        joinedAt: new Date('2024-01-01'),
        totalPicks: 0,
      };

      addExpert(expert);

      // Ajouter des picks
      const pick1: ExpertPick = {
        id: 'pick-1',
        expertId: 'test-expert',
        title: 'Book 1',
        author: 'Author 1',
        category: 'book',
        shortWhy: 'Great book 1',
        fullDescription: 'Description 1',
        featured: false,
        isPickOfTheWeek: false,
        weekOf: new Date('2024-11-18'),
        createdAt: new Date('2024-11-17'),
        updatedAt: new Date('2024-11-17'),
        tags: ['fiction'],
        isActive: true,
      };

      const pick2: ExpertPick = {
        id: 'pick-2',
        expertId: 'test-expert',
        title: 'Book 2',
        author: 'Author 2',
        category: 'book',
        shortWhy: 'Great book 2',
        fullDescription: 'Description 2',
        featured: false,
        isPickOfTheWeek: false,
        weekOf: new Date('2024-11-25'),
        createdAt: new Date('2024-11-24'),
        updatedAt: new Date('2024-11-24'),
        tags: ['fiction'],
        isActive: true,
      };

      const currentPick: ExpertPick = {
        id: 'current-pick',
        expertId: 'test-expert',
        title: 'Current Book',
        author: 'Current Author',
        category: 'book',
        shortWhy: 'Current pick!',
        fullDescription: 'Current description',
        featured: true,
        isPickOfTheWeek: true,
        weekOf: new Date('2024-12-02'),
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-01'),
        tags: ['fiction'],
        isActive: true,
      };

      addExpertPick(pick1);
      addExpertPick(pick2);
      addExpertPick(currentPick);

      const previousPicks = getPreviousPicks();

      // Doit retourner seulement les picks précédents (pas le current)
      expect(previousPicks).toHaveLength(2);

      // Doit être trié par date (plus récent en premier)
      expect(previousPicks[0]).toEqual(pick2);
      expect(previousPicks[1]).toEqual(pick1);
    });
  });

  describe('getExpertById', () => {
    it('should return expert by ID', () => {
      const { addExpert, getExpertById } = useExpertStore.getState();

      const expert: Expert = {
        id: 'test-expert',
        name: 'Test Expert',
        bio: 'Test bio',
        specialty: 'Literature & Fiction',
        photoUrl: 'https://example.com/photo.jpg',
        expertise: ['book'],
        isActive: true,
        joinedAt: new Date('2024-01-01'),
        totalPicks: 0,
      };

      addExpert(expert);

      const result = getExpertById('test-expert');
      expect(result).toEqual(expert);
    });

    it('should return undefined for non-existent expert', () => {
      const { getExpertById } = useExpertStore.getState();
      const result = getExpertById('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('getPicksByExpert', () => {
    it('should return picks by expert ID', () => {
      const { addExpert, addExpertPick, getPicksByExpert } = useExpertStore.getState();

      // Ajouter deux experts
      const expert1: Expert = {
        id: 'expert-1',
        name: 'Expert 1',
        bio: 'Bio 1',
        specialty: 'Literature',
        photoUrl: 'https://example.com/photo1.jpg',
        expertise: ['book'],
        isActive: true,
        joinedAt: new Date('2024-01-01'),
        totalPicks: 0,
      };

      const expert2: Expert = {
        id: 'expert-2',
        name: 'Expert 2',
        bio: 'Bio 2',
        specialty: 'Fiction',
        photoUrl: 'https://example.com/photo2.jpg',
        expertise: ['book'],
        isActive: true,
        joinedAt: new Date('2024-01-01'),
        totalPicks: 0,
      };

      addExpert(expert1);
      addExpert(expert2);

      // Ajouter des picks pour chaque expert
      const pick1: ExpertPick = {
        id: 'pick-1',
        expertId: 'expert-1',
        title: 'Book 1',
        author: 'Author 1',
        category: 'book',
        shortWhy: 'Great!',
        fullDescription: 'Description 1',
        featured: true,
        isPickOfTheWeek: true,
        weekOf: new Date('2024-12-02'),
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-01'),
        tags: ['fiction'],
        isActive: true,
      };

      const pick2: ExpertPick = {
        id: 'pick-2',
        expertId: 'expert-2',
        title: 'Book 2',
        author: 'Author 2',
        category: 'book',
        shortWhy: 'Amazing!',
        fullDescription: 'Description 2',
        featured: false,
        isPickOfTheWeek: false,
        weekOf: new Date('2024-11-25'),
        createdAt: new Date('2024-11-24'),
        updatedAt: new Date('2024-11-24'),
        tags: ['non-fiction'],
        isActive: true,
      };

      const pick3: ExpertPick = {
        id: 'pick-3',
        expertId: 'expert-1',
        title: 'Book 3',
        author: 'Author 3',
        category: 'book',
        shortWhy: 'Excellent!',
        fullDescription: 'Description 3',
        featured: false,
        isPickOfTheWeek: false,
        weekOf: new Date('2024-11-18'),
        createdAt: new Date('2024-11-17'),
        updatedAt: new Date('2024-11-17'),
        tags: ['biography'],
        isActive: true,
      };

      addExpertPick(pick1);
      addExpertPick(pick2);
      addExpertPick(pick3);

      // Tester les picks pour expert-1
      const expert1Picks = getPicksByExpert('expert-1');
      expect(expert1Picks).toHaveLength(2);
      expect(expert1Picks).toContain(pick1);
      expect(expert1Picks).toContain(pick3);

      // Tester les picks pour expert-2
      const expert2Picks = getPicksByExpert('expert-2');
      expect(expert2Picks).toHaveLength(1);
      expect(expert2Picks).toContain(pick2);

      // Tester pour expert inexistant
      const noPicks = getPicksByExpert('non-existent');
      expect(noPicks).toHaveLength(0);
    });
  });
});
