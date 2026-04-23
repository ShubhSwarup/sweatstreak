import { create } from 'zustand';
import { dashboardApi } from '../api/dashboard.api';
import type { DashboardData } from '../types';

interface DashboardState extends DashboardData {
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetch: () => Promise<void>;
}

const defaultState: DashboardData = {
  streak: { current: 0, longest: 0 },
  xp: { total: 0, level: 1 },
  lastWorkout: null,
  weeklyVolume: 0,
  volumeByDay: {},
  topExercises: [],
  todayPlan: null,
  isFirstTimeUser: true,
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  ...defaultState,
  isLoading: false,
  error: null,
  lastFetched: null,

  fetch: async () => {
    const { lastFetched } = get();
    // Cache for 2 minutes — avoid refetch on every tab switch
    if (lastFetched && Date.now() - lastFetched < 120000) return;

    set({ isLoading: true, error: null });
    try {
      const data = await dashboardApi.getDashboard('');
      set({ ...data, isLoading: false, lastFetched: Date.now() });
    } catch (err: any) {
      set({ error: err?.message || 'Failed to load dashboard', isLoading: false });
    }
  },
}));
