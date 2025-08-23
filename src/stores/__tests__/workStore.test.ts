import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useWorkStore } from '../workStore';
import type { WorkType } from '../../types/WorkType';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('workStore', () => {
  beforeEach(async () => {
    // Reset le store avant chaque test
    useWorkStore.setState({
      works: [],
      progressEvents: [],
      isLoading: false,
      error: null,
    });

    // Reset les mocks
    vi.clearAllMocks();

    // Initialiser les services
    await useWorkStore.getState().initialize();
  });

  describe('addWork', () => {
    it('should add a new work to the store', async () => {
      const { addWork } = useWorkStore.getState();

      const newWork: Omit<WorkType, 'id' | 'createdAtISO' | 'status' | 'progress' | 'completedAtISO'> = {
        title: 'Test Work',
        category: 'book',
        imageUrl: 'https://example.com/image.jpg',
        moodId: [1, 2],
        smartTags: ['quick'],
        notes: 'Test notes',
        isFavorite: false,
      };

      await addWork(newWork);

      const { works } = useWorkStore.getState();
      expect(works).toHaveLength(1);
      expect(works[0]).toMatchObject({
        ...newWork,
        id: expect.any(String),
        createdAtISO: expect.any(String),
        status: 'backlog',
        progress: 0,
      });
    });

    it('should generate unique ID for each work', async () => {
      const { addWork } = useWorkStore.getState();

      const workData = {
        title: 'Test Work',
        category: 'book' as const,
        imageUrl: 'https://example.com/image.jpg',
        moodId: [1],
        smartTags: [],
        notes: '',
        isFavorite: false,
      };

      await addWork(workData);
      await addWork(workData);

      const { works } = useWorkStore.getState();
      expect(works).toHaveLength(2);
      expect(works[0].id).not.toBe(works[1].id);
    });
  });

  describe('updateWork', () => {
    it('should update an existing work', async () => {
      const { addWork, updateWork } = useWorkStore.getState();

      const workData = {
        title: 'Original Title',
        category: 'book' as const,
        imageUrl: 'https://example.com/image.jpg',
        moodId: [1],
        smartTags: [],
        notes: '',
        isFavorite: false,
      };

      await addWork(workData);
      const { works } = useWorkStore.getState();

      const updatedWork: WorkType = {
        ...works[0],
        title: 'Updated Title',
        status: 'in-progress',
      };

      await updateWork(updatedWork);

      const { works: updatedWorks } = useWorkStore.getState();
      expect(updatedWorks[0].title).toBe('Updated Title');
      expect(updatedWorks[0].status).toBe('in-progress');
      expect(updatedWorks[0].category).toBe('book'); // Non modifié
    });

    it('should not update if work ID does not exist', async () => {
      const { updateWork, works } = useWorkStore.getState();

      const nonExistentWork: WorkType = {
        id: 'non-existent-id',
        title: 'Updated Title',
        category: 'book',
        imageUrl: 'https://example.com/image.jpg',
        status: 'backlog',
        moodId: [],
        smartTags: [],
        notes: '',
        isFavorite: false,
        createdAtISO: new Date().toISOString(),
        progress: 0,
      };

      await updateWork(nonExistentWork);

      expect(works).toHaveLength(0);
    });
  });

  describe('deleteWork', () => {
    it('should remove a work from the store', async () => {
      const { addWork, deleteWork } = useWorkStore.getState();

      const workData = {
        title: 'Test Work',
        category: 'book' as const,
        imageUrl: 'https://example.com/image.jpg',
        moodId: [1],
        smartTags: [],
        notes: '',
        isFavorite: false,
      };

      await addWork(workData);
      const { works } = useWorkStore.getState();
      expect(works).toHaveLength(1);

      await deleteWork(works[0].id);

      const { works: remainingWorks } = useWorkStore.getState();
      expect(remainingWorks).toHaveLength(0);
    });

    it('should not affect other works when deleting', async () => {
      const { addWork, deleteWork } = useWorkStore.getState();

      const workData1 = {
        title: 'Work 1',
        category: 'book' as const,
        imageUrl: 'https://example.com/image1.jpg',
        moodId: [1],
        smartTags: [],
        notes: '',
        isFavorite: false,
      };

      const workData2 = {
        title: 'Work 2',
        category: 'movie' as const,
        imageUrl: 'https://example.com/image2.jpg',
        moodId: [2],
        smartTags: [],
        notes: '',
        isFavorite: false,
      };

      await addWork(workData1);
      await addWork(workData2);
      const { works } = useWorkStore.getState();
      expect(works).toHaveLength(2);

      // Supprimer le premier work (workData2 qui est à l'index 0)
      await deleteWork(works[0].id);

      const { works: remainingWorks } = useWorkStore.getState();
      expect(remainingWorks).toHaveLength(1);
      // Vérifier que le work restant est bien Work 1 (workData1)
      expect(remainingWorks[0].title).toBe('Work 1');
      expect(remainingWorks[0].category).toBe('book');
    });
  });

  describe('getWorkById', () => {
    it('should return work by ID', async () => {
      const { addWork, getWorkById } = useWorkStore.getState();

      const workData = {
        title: 'Test Work',
        category: 'book' as const,
        imageUrl: 'https://example.com/image.jpg',
        moodId: [1],
        smartTags: [],
        notes: '',
        isFavorite: false,
      };

      await addWork(workData);
      const { works } = useWorkStore.getState();
      const workId = works[0].id;

      const foundWork = getWorkById(workId);
      expect(foundWork).toBeDefined();
      expect(foundWork?.title).toBe('Test Work');
    });

    it('should return undefined for non-existent work', () => {
      const { getWorkById } = useWorkStore.getState();

      const foundWork = getWorkById('non-existent-id');
      expect(foundWork).toBeUndefined();
    });
  });
});
