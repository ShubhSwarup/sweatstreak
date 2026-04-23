import apiClient from './client';
import type { Exercise } from '../types';
import { mapExercise } from './mappers';

export const exercisesApi = {
  getExercises: async (params?: { muscleGroup?: string; search?: string; page?: number; limit?: number }) => {
    const { data } = await apiClient.get<{
      data: Record<string, unknown>[];
      pagination: { total: number; page: number; pages: number; limit: number };
    }>('/exercises', { params });
    return {
      data: (data.data ?? []).map((row) => mapExercise(row)),
      pagination: data.pagination,
    };
  },

  getExerciseById: async (exerciseId: string): Promise<Exercise> => {
    const { data } = await apiClient.get<{ success: boolean; data: Record<string, unknown> }>(`/exercises/${exerciseId}`);
    return mapExercise(data.data);
  },

  getSuggestedExercises: async (params?: { muscleGroup?: string; limit?: number }) => {
    const { data } = await apiClient.get<{ success: boolean; data: Record<string, unknown>[] }>('/exercises/suggested', { params });
    return (data.data ?? []).map((row) => mapExercise(row));
  },

  getLastPerformance: async (exerciseId: string) => {
    const { data } = await apiClient.get(`/sessions/exercises/${exerciseId}/last-performance`);
    return data.data;
  },
};
