import { create } from 'zustand';
import { sessionsApi } from '../api/sessions.api';
import type { WorkoutSession, SessionExercise, SetData } from '../types';

interface SessionState {
  activeSession: WorkoutSession | null;
  hasActiveSession: boolean;
  sessionStatus: 'active' | 'paused' | null;
  isLoading: boolean;
  elapsedSeconds: number;
  finishResult: any | null;

  // Actions
  fetchActiveSession: () => Promise<void>;
  startSession: (payload: { name?: string; template?: string }) => Promise<WorkoutSession>;
  addExercise: (exerciseId: string, exerciseName: string) => Promise<void>;
  removeExercise: (exerciseIndex: number) => Promise<void>;
  // addSet: (exerciseIndex: number, setData: Partial<SetData>) => Promise<void>;
  // updateSetLocally: (exerciseIndex: number, setIndex: number, data: Partial<SetData>) => void;
  // markSetComplete: (exerciseIndex: number, setIndex: number) => Promise<void>;
  createSet: (exerciseId: string) => Promise<void>;
  updateSet: (setId: string, data: Partial<SetData>) => Promise<void>;
  completeSet: (setId: string) => Promise<void>;
  finishSession: () => Promise<any>;
  pauseSession: () => Promise<void>;
  resumeSession: () => Promise<void>;
  discardSession: () => Promise<void>;
  tickTimer: () => void;
  clearFinishResult: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  activeSession: null,
  hasActiveSession: false,
  sessionStatus: null,
  isLoading: false,
  elapsedSeconds: 0,
  finishResult: null,

  fetchActiveSession: async () => {
    try {
      const session = await sessionsApi.getActiveSession();
      if (session) {
        const elapsed = Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000);
        set({ activeSession: session, hasActiveSession: true, sessionStatus: session.status as any, elapsedSeconds: elapsed });
      } else {
        set({ activeSession: null, hasActiveSession: false, sessionStatus: null });
      }
    } catch {}
  },

  startSession: async (payload) => {
    set({ isLoading: true });
    try {
      const session = await sessionsApi.startSession(payload);
      set({ activeSession: session, hasActiveSession: true, sessionStatus: 'active', elapsedSeconds: 0, isLoading: false });
      return session;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  addExercise: async (exerciseId, exerciseName) => {
    const { activeSession } = get();
    if (!activeSession) return;
    const order = activeSession.exercises.length + 1;
    try {
      await sessionsApi.addExercise(activeSession.id, { exercise: exerciseId, order });
      // Optimistic update
      const newExercise: SessionExercise = {
        exerciseId, name: exerciseName, exerciseType: 'strength',
        order, restSeconds: 90, lastPerformance: null, suggestion: null,
        sets: [{ setNumber: 1, weight: null, reps: null, completed: false, isPR: false }],
      };
      set((state) => ({
        activeSession: state.activeSession
          ? { ...state.activeSession, exercises: [...state.activeSession.exercises, newExercise] }
          : null,
      }));
    } catch {}
  },

  removeExercise: async (exerciseIndex) => {
    const { activeSession } = get();
    if (!activeSession) return;
    // Optimistic update first
    const newExercises = activeSession.exercises.filter((_, i) => i !== exerciseIndex)
      .map((ex, i) => ({ ...ex, order: i + 1 }));
    set((state) => ({
      activeSession: state.activeSession ? { ...state.activeSession, exercises: newExercises } : null,
    }));
    try {
      await sessionsApi.removeExercise(activeSession.id, exerciseIndex);
    } catch {
      // Revert on failure
      set({ activeSession });
    }
  },
  createSet: async (exerciseId: string) => {
    const { activeSession } = get();
    if (!activeSession) return;
  
    try {
      const newSet = await sessionsApi.createSet(activeSession.id, exerciseId);
  
      set((state) => {
        if (!state.activeSession) return state;
  
        const exercises = state.activeSession.exercises.map((ex) =>
          ex.exerciseId === exerciseId
            ? { ...ex, sets: [...ex.sets, newSet] }
            : ex
        );
  
        return { activeSession: { ...state.activeSession, exercises } };
      });
    } catch {}
  },
  updateSet: async (setId: string, data: Partial<SetData>) => {
    const { activeSession } = get();
    if (!activeSession) return;
  
    // optimistic update
    set((state) => {
      if (!state.activeSession) return state;
  
      const exercises = state.activeSession.exercises.map((ex) => ({
        ...ex,
        sets: ex.sets.map((s) =>
          s.id === setId ? { ...s, ...data } : s
        ),
      }));
  
      return { activeSession: { ...state.activeSession, exercises } };
    });
  
    try {
      await sessionsApi.updateSet(activeSession.id, setId, data);
    } catch {}
  },
  completeSet: async (setId: string) => {
    const { activeSession } = get();
    if (!activeSession) return;
  
    try {
      const result = await sessionsApi.completeSet(activeSession.id, setId);
  
      set((state) => {
        if (!state.activeSession) return state;
  
        const exercises = state.activeSession.exercises.map((ex) => ({
          ...ex,
          sets: ex.sets.map((s) =>
            s.id === setId ? { ...s, completed: true } : s
          ),
        }));
  
        return { activeSession: { ...state.activeSession, exercises } };
      });
  
    } catch {}
  },

  // updateSetLocally: (exerciseIndex, setIndex, data) => {
  //   set((state) => {
  //     if (!state.activeSession) return state;
  //     const exercises = [...state.activeSession.exercises];
  //     const exercise = { ...exercises[exerciseIndex] };
  //     const sets = [...exercise.sets];
  //     sets[setIndex] = { ...sets[setIndex], ...data };
  //     exercise.sets = sets;
  //     exercises[exerciseIndex] = exercise;
  //     return { activeSession: { ...state.activeSession, exercises } };
  //   });
  // },

  // addSet: async (exerciseIndex, setData) => {
  //   const { activeSession } = get();
  //   if (!activeSession) return;
  //   try {
  //     await sessionsApi.addSet(activeSession.id, { exerciseIndex, ...setData });
  //   } catch {}
  // },

  // markSetComplete: async (exerciseIndex, setIndex) => {
  //   const { activeSession, updateSetLocally } = get();
  //   if (!activeSession) return;
  //   const exercise = activeSession.exercises[exerciseIndex];
  //   const set = exercise.sets[setIndex];
  //   // Optimistic
  //   updateSetLocally(exerciseIndex, setIndex, { completed: true });
  //   try {
  //     await sessionsApi.addSet(activeSession.id, {
  //       exerciseIndex, weight: set.weight, reps: set.reps,
  //       durationSeconds: set.durationSeconds, distance: set.distance,
  //     });
  //   } catch {
  //     updateSetLocally(exerciseIndex, setIndex, { completed: false });
  //   }
  // },

  finishSession: async () => {
    const { activeSession } = get();
    if (!activeSession) return;
    set({ isLoading: true });
    try {
      const result = await sessionsApi.finishSession(activeSession.id);
      set({ activeSession: null, hasActiveSession: false, sessionStatus: null, elapsedSeconds: 0, finishResult: result, isLoading: false });
      return result;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  pauseSession: async () => {
    const { activeSession } = get();
    if (!activeSession) return;
    set({ sessionStatus: 'paused' });
    try {
      await sessionsApi.pauseSession(activeSession.id);
      set((state) => ({ activeSession: state.activeSession ? { ...state.activeSession, status: 'paused' } : null }));
    } catch {
      set({ sessionStatus: 'active' });
    }
  },

  resumeSession: async () => {
    const { activeSession } = get();
    if (!activeSession) return;
    set({ sessionStatus: 'active' });
    try {
      await sessionsApi.resumeSession(activeSession.id);
      set((state) => ({ activeSession: state.activeSession ? { ...state.activeSession, status: 'active' } : null }));
    } catch {
      set({ sessionStatus: 'paused' });
    }
  },

  discardSession: async () => {
    const { activeSession } = get();
    if (!activeSession) return;
    try {
      await sessionsApi.discardSession(activeSession.id);
    } catch {}
    set({ activeSession: null, hasActiveSession: false, sessionStatus: null, elapsedSeconds: 0 });
  },

  tickTimer: () => set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 })),

  clearFinishResult: () => set({ finishResult: null }),
}));
