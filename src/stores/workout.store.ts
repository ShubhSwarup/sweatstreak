import { create } from 'zustand';
import { templatesApi } from '../api/templates.api';
import { exercisesApi } from '../api/exercises.api';
import type { WorkoutTemplate, Exercise, HubMode, HubContext } from '../types';

interface WorkoutState {
  hubContext: HubContext;
  templates: WorkoutTemplate[];
  systemTemplates: WorkoutTemplate[];
  userTemplates: WorkoutTemplate[];
  suggestedExercises: Exercise[];
  allExercises: Exercise[];
  isLoadingTemplates: boolean;
  isLoadingExercises: boolean;
  searchQuery: string;
  selectedMuscleGroup: string | null;

  // Actions
  setHubContext: (ctx: HubContext) => void;
  fetchTemplates: () => Promise<void>;
  fetchExercises: (params?: { search?: string; muscleGroup?: string; limit?: number }) => Promise<void>;
  fetchSuggestedExercises: () => Promise<void>;
  setSearchQuery: (q: string) => void;
  setMuscleGroup: (mg: string | null) => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  hubContext: { mode: 'default', source: 'tab' },
  templates: [], systemTemplates: [], userTemplates: [],
  suggestedExercises: [], allExercises: [],
  isLoadingTemplates: false, isLoadingExercises: false,
  searchQuery: '', selectedMuscleGroup: null,

  setHubContext: (ctx) => set({ hubContext: ctx }),

  fetchTemplates: async () => {
    set({ isLoadingTemplates: true });
    try {
      const [allRes, systemRes, userRes] = await Promise.all([
        templatesApi.getTemplates(),
        templatesApi.getTemplates({ type: 'system' }),
        templatesApi.getTemplates({ type: 'user' }),
      ]) as any[];
      set({
        templates: allRes.templates,
        systemTemplates: systemRes.templates,
        userTemplates: userRes.templates,
        isLoadingTemplates: false,
      });
    } catch {
      set({ isLoadingTemplates: false });
    }
  },

  fetchExercises: async (params) => {
    set({ isLoadingExercises: true });
    try {
      const res = await exercisesApi.getExercises(params) as any;
      set({ allExercises: res.data, isLoadingExercises: false });
    } catch {
      set({ isLoadingExercises: false });
    }
  },

  fetchSuggestedExercises: async () => {
    try {
      const exercises = await exercisesApi.getSuggestedExercises({ limit: 6 }) as Exercise[];
      set({ suggestedExercises: exercises });
    } catch {}
  },

  setSearchQuery: (q) => set({ searchQuery: q }),
  setMuscleGroup: (mg) => set({ selectedMuscleGroup: mg }),
}));
