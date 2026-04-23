import { create } from 'zustand';
import { plansApi } from '../api/plans.api';
import type { WorkoutPlan, TodayPlan } from '../types';

interface PlanState {
  activePlan: WorkoutPlan | null;
  allPlans: WorkoutPlan[];
  todayWorkout: TodayPlan | null;
  isLoading: boolean;

  fetch: () => Promise<void>;
  skipDay: () => Promise<void>;
  restartPlan: () => Promise<void>;
  activatePlan: (planId: string) => Promise<void>;
  fetchAllPlans: () => Promise<void>;
}

export const usePlanStore = create<PlanState>((set) => ({
  activePlan: null,
  allPlans: [],
  todayWorkout: null,
  isLoading: false,

  fetch: async () => {
    set({ isLoading: true });
    try {
      const [activePlan, todayWorkout] = await Promise.all([
        plansApi.getActivePlan(),
        plansApi.getTodayWorkout(),
      ]);
      set({ activePlan, todayWorkout, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  skipDay: async () => {
    try {
      const plan = await plansApi.skipDay();
      const today = await plansApi.getTodayWorkout();
      set({ activePlan: plan, todayWorkout: today });
    } catch {}
  },

  restartPlan: async () => {
    try {
      const plan = await plansApi.restartPlan();
      const today = await plansApi.getTodayWorkout();
      set({ activePlan: plan, todayWorkout: today });
    } catch {}
  },

  activatePlan: async (planId) => {
    try {
      const plan = await plansApi.activatePlan(planId);
      const today = await plansApi.getTodayWorkout();
      set({ activePlan: plan, todayWorkout: today });
    } catch {}
  },

  fetchAllPlans: async () => {
    try {
      const plans = await plansApi.getPlans();
      set({ allPlans: plans });
    } catch {}
  },
}));
