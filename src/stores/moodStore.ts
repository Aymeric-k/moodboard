import { create } from 'zustand';
import type { MoodEventType } from '../types/MoodEventType';
import type { IMoodService } from '../services/interfaces';

// The shape of the data for today's moods, including the date.
interface TodayMoodsData {
  date: string; // ISO date string 'YYYY-MM-DD'
  moods: number[];
}

interface MoodState {
  historicalEvents: MoodEventType[];
  todayMoodsData: TodayMoodsData;
  moodService: IMoodService | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  toggleTodayMood: (moodId: number) => Promise<void>;
  resetTodayMoods: () => Promise<void>;
  commitMoodsIfNewDay: () => Promise<void>;

  // Initialisation
  initialize: (moodService: IMoodService) => Promise<void>;
}

const getTodayISO = () => new Intl.DateTimeFormat('fr-CA').format(new Date());

export const useMoodStore = create<MoodState>((set, get) => ({
  historicalEvents: [],
  todayMoodsData: {
    date: getTodayISO(),
    moods: [],
  },
  moodService: null,
  isLoading: false,
  error: null,

  // Initialisation avec le service
  initialize: async (moodService: IMoodService) => {
    try {
      set({ isLoading: true, error: null, moodService });

      const [historicalEvents, todayMoodsData] = await Promise.all([
        moodService.getHistoricalEvents(),
        moodService.getTodayMoodsData()
      ]);

      set({ historicalEvents, todayMoodsData, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize moods',
        isLoading: false
      });
    }
  },

          // Actions
  toggleTodayMood: async (moodId: number) => {
    const { moodService } = get();

    if (!moodService) {
      set({ error: 'Mood service not initialized' });
      return;
    }

    try {
      const currentMoods = get().todayMoodsData.moods;
      const newMoods = new Set(currentMoods);
      newMoods.has(moodId) ? newMoods.delete(moodId) : newMoods.add(moodId);
      const updatedMoods = Array.from(newMoods);

      // On met à jour l'état global pour la logique
      set((state) => ({
        ...state,
        todayMoodsData: { ...state.todayMoodsData, moods: updatedMoods }
      }));

      // Persistence différée (asynchrone en arrière-plan)
      moodService.setTodayMoodsData({
        date: get().todayMoodsData.date,
        moods: updatedMoods
      }).catch(error => {
        console.error('Failed to persist mood:', error);
        set({ error: 'Failed to persist mood' });
      });

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to toggle mood'
      });
    }
  },

    resetTodayMoods: async () => {
    const { moodService } = get();
    if (!moodService) {
      set({ error: 'Mood service not initialized' });
      return;
    }

    try {
      // Mise à jour immédiate de l'UI (synchrone)
      const resetData = { ...get().todayMoodsData, moods: [] };
      set({ todayMoodsData: resetData });

      // Persistence différée (asynchrone en arrière-plan)
      moodService.setTodayMoodsData(resetData).catch(error => {
        console.error('Failed to persist reset moods:', error);
        set({ error: 'Failed to persist reset moods' });
      });

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reset moods'
      });
    }
  },

  commitMoodsIfNewDay: async () => {
    const { moodService } = get();
    if (!moodService) {
      set({ error: 'Mood service not initialized' });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      const { todayMoodsData, historicalEvents } = get();
      const todayISO = getTodayISO();

      if (todayMoodsData.date !== todayISO && todayMoodsData.moods.length > 0) {
        const eventsToCommit: MoodEventType[] = todayMoodsData.moods.map((moodId) => ({
          id: crypto.randomUUID(),
          moodId,
          tsISO: new Date(`${todayMoodsData.date}T12:00:00`).toISOString(),
        }));

        const newHistoricalEvents = [...historicalEvents, ...eventsToCommit];
        const newTodayMoodsData = { date: todayISO, moods: [] };

        await Promise.all([
          moodService.setHistoricalEvents(newHistoricalEvents),
          moodService.setTodayMoodsData(newTodayMoodsData)
        ]);

        set({
          historicalEvents: newHistoricalEvents,
          todayMoodsData: newTodayMoodsData,
          isLoading: false
        });
      } else if (todayMoodsData.date !== todayISO) {
        const newTodayMoodsData = { date: todayISO, moods: [] };
        await moodService.setTodayMoodsData(newTodayMoodsData);
        set({ todayMoodsData: newTodayMoodsData, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to commit moods',
        isLoading: false
      });
    }
  },
}));

