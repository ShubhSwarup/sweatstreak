import apiClient from './client';
import type { WorkoutPlan, TodayPlan } from '../types';
import { mapTodayPlan, mapWorkoutPlan } from './mappers';

export const plansApi = {
  getActivePlan: async (): Promise<WorkoutPlan | null> => {
    const { data } = await apiClient.get<{ success: boolean; data: Record<string, unknown> | null }>(
      '/workoutPlan/active'
    );
    return mapWorkoutPlan((data.data as Record<string, unknown> | null) ?? null);
  },

  getTodayWorkout: async (): Promise<TodayPlan | null> => {
    const { data } = await apiClient.get<{ success: boolean; data: Record<string, unknown> | null }>(
      '/workoutPlan/today'
    );
    return mapTodayPlan((data.data as Record<string, unknown> | null) ?? null);
  },

  createPlan: async (payload: { name: string; days: unknown[] }): Promise<WorkoutPlan> => {
    const { data } = await apiClient.post('/workoutPlan', payload);
    const mapped = mapWorkoutPlan(data.data as Record<string, unknown>);
    if (!mapped) throw new Error('Invalid plan');
    return mapped;
  },

  skipDay: async (): Promise<WorkoutPlan> => {
    const { data } = await apiClient.post('/workoutPlan/skip');
    const mapped = mapWorkoutPlan(data.data as Record<string, unknown>);
    if (!mapped) throw new Error('Invalid plan');
    return mapped;
  },

  restartPlan: async (): Promise<WorkoutPlan> => {
    const { data } = await apiClient.post('/workoutPlan/restart');
    const mapped = mapWorkoutPlan(data.data as Record<string, unknown>);
    if (!mapped) throw new Error('Invalid plan');
    return mapped;
  },

  activatePlan: async (planId: string): Promise<WorkoutPlan> => {
    const { data } = await apiClient.post(`/workoutPlan/${planId}/activate`);
    const mapped = mapWorkoutPlan(data.data as Record<string, unknown>);
    if (!mapped) throw new Error('Invalid plan');
    return mapped;
  },

  getPlans: async (): Promise<WorkoutPlan[]> => {
    const { data } = await apiClient.get<{ success: boolean; data: Record<string, unknown>[] }>('/workoutPlan');
    return (data.data ?? [])
      .map((p) => mapWorkoutPlan(p))
      .filter((p): p is WorkoutPlan => p != null);
  },
};
