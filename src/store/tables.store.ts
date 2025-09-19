import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TablesStats {
  today: number;
  yesterday: number;
  total: number;
  lastUpdated: number;
}

interface TablesState {
  stats: TablesStats;
  addTables: (count: number) => void;
  resetTodayTables: () => void;
  resetAllTables: () => Promise<void>;
  loadStats: () => void;
}

const defaultStats: TablesStats = {
  today: 0,
  yesterday: 0,
  total: 0,
  lastUpdated: Date.now()
};

export const useTables = create<TablesState>()(
  persist(
    (set, get) => ({
      stats: defaultStats,

      addTables: (count: number) => {
        set((state) => ({
          stats: {
            ...state.stats,
            today: Math.max(0, state.stats.today + count),
            total: Math.max(0, state.stats.total + count),
            lastUpdated: Date.now()
          }
        }));
      },

      resetTodayTables: () => {
        set((state) => ({
          stats: {
            ...state.stats,
            today: 0,
            lastUpdated: Date.now()
          }
        }));
      },

      resetAllTables: async () => {
        set(() => ({
          stats: defaultStats
        }));
      },

      loadStats: () => {
        // Загружаем статистику из localStorage
        const saved = localStorage.getItem('tables-storage');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.state?.stats) {
              set({ stats: parsed.state.stats });
            }
          } catch (error) {
            console.error('Error loading tables stats:', error);
          }
        }
      }
    }),
    {
      name: 'tables-storage',
    }
  )
);
