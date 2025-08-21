import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { MoodEventType } from '../types/MoodEventType';

// The shape of the data for today's moods, including the date.
interface TodayMoodsData {
  date: string; // ISO date string 'YYYY-MM-DD'
  moods: number[];
}

interface MoodState {
  historicalEvents: MoodEventType[];
  todayMoodsData: TodayMoodsData;
  // Actions
  toggleTodayMood: (moodId: number) => void;
  resetTodayMoods: () => void;
  commitMoodsIfNewDay: () => void;
}

const getTodayISO = () => new Intl.DateTimeFormat('fr-CA').format(new Date());

export const useMoodStore = create<MoodState>()(
  persist(
    (set, get) => ({
      historicalEvents: [],
      todayMoodsData: {
        date: getTodayISO(),
        moods: [],
      },

      toggleTodayMood: (moodId: number) => {
        set((state) => {
          const newMoods = new Set(state.todayMoodsData.moods);
          newMoods.has(moodId) ? newMoods.delete(moodId) : newMoods.add(moodId);
          return {
            todayMoodsData: { ...state.todayMoodsData, moods: Array.from(newMoods) },
          };
        });
      },

      resetTodayMoods: () => {
        set((state) => ({
          todayMoodsData: { ...state.todayMoodsData, moods: [] },
        }));
      },

      commitMoodsIfNewDay: () => {
        const { todayMoodsData, historicalEvents } = get();
        const todayISO = getTodayISO();

        if (todayMoodsData.date !== todayISO && todayMoodsData.moods.length > 0) {
          const eventsToCommit: MoodEventType[] = todayMoodsData.moods.map((moodId) => ({
            id: crypto.randomUUID(),
            moodId,
            tsISO: new Date(`${todayMoodsData.date}T12:00:00`).toISOString(),
          }));

          set({
            historicalEvents: [...historicalEvents, ...eventsToCommit],
            todayMoodsData: { date: todayISO, moods: [] },
          });
        } else if (todayMoodsData.date !== todayISO) {
          set({ todayMoodsData: { date: todayISO, moods: [] } });
        }
      },
    }),
    {
      name: 'moodboard-mood-storage',
      storage: createJSONStorage(() => localStorage),
      // On ne persiste que l'essentiel.
      partialize: (state) => ({
        historicalEvents: state.historicalEvents,
        todayMoodsData: state.todayMoodsData,
      }),
    }
  )
);

