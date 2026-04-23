import apiClient from "./client";
import type { WorkoutSession, FinishSessionResult, SetData } from "../types";
import { mapFinishResult, mapWorkoutSession } from "./mappers";

export const sessionsApi = {
  getActiveSession: async (): Promise<WorkoutSession | null> => {
    const { data } = await apiClient.get<{
      success: boolean;
      data: Record<string, unknown> | null;
    }>("/sessions/active");
    return mapWorkoutSession(data.data as Record<string, unknown> | null);
  },

  startSession: async (payload: {
    name?: string;
    template?: string;
  }): Promise<WorkoutSession> => {
    const { data } = await apiClient.post<{
      success: boolean;
      data: { session: Record<string, unknown>; isExisting: boolean };
    }>("/sessions/start", payload);
    const mapped = mapWorkoutSession(data.data.session);
    if (!mapped) throw new Error("Could not start session");
    return mapped;
  },

  addExercise: async (
    sessionId: string,
    payload: { exercise: string; order: number; restSeconds?: number }
  ) => {
    const { data } = await apiClient.post(
      `/sessions/${sessionId}/exercises`,
      payload
    );
    return mapWorkoutSession(data.data as Record<string, unknown>);
  },

  removeExercise: async (sessionId: string, exerciseIndex: number) => {
    const { data } = await apiClient.delete(
      `/sessions/${sessionId}/exercises/${exerciseIndex}`
    );
    return mapWorkoutSession(data.data as Record<string, unknown>);
  },

  // addSet: async (sessionId: string, payload: { exerciseIndex: number } & Partial<SetData>) => {
  //   const { data } = await apiClient.post(`/sessions/${sessionId}/sets`, payload);
  //   return data.data;
  // },

  createSet: async (sessionId: string, exerciseId: string) => {
    const { data } = await apiClient.post(
      `/sessions/${sessionId}/exercises/${exerciseId}/sets`
    );
    return data.data;
  },

  updateSet: async (
    sessionId: string,
    setId: string,
    payload: Partial<SetData>
  ) => {
    const { data } = await apiClient.patch(
      `/sessions/${sessionId}/sets/${setId}`,
      payload
    );
    return data.data;
  },

  completeSet: async (sessionId: string, setId: string) => {
    const { data } = await apiClient.patch(
      `/sessions/${sessionId}/sets/${setId}/complete`
    );
    return data.data;
  },

  finishSession: async (sessionId: string): Promise<FinishSessionResult> => {
    const { data } = await apiClient.post(`/sessions/${sessionId}/finish`);
    return mapFinishResult(data.data as Record<string, unknown>);
  },

  pauseSession: async (sessionId: string) => {
    const { data } = await apiClient.post(`/sessions/${sessionId}/pause`);
    return mapWorkoutSession(data.data as Record<string, unknown>);
  },

  resumeSession: async (sessionId: string) => {
    const { data } = await apiClient.post(`/sessions/${sessionId}/resume`);
    return mapWorkoutSession(data.data as Record<string, unknown>);
  },

  discardSession: async (sessionId: string) => {
    await apiClient.post(`/sessions/${sessionId}/discard`);
  },

  getSessions: async (page = 1, limit = 10) => {
    const { data } = await apiClient.get("/sessions", {
      params: { page, limit },
    });
    return data.data;
  },

  getSessionById: async (sessionId: string): Promise<WorkoutSession> => {
    const { data } = await apiClient.get(`/sessions/${sessionId}`);
    const mapped = mapWorkoutSession(data.data as Record<string, unknown>);
    if (!mapped) throw new Error("Session not found");
    return mapped;
  },

  getCalendar: async (startDate: string, endDate: string) => {
    const { data } = await apiClient.get("/sessions/calendar", {
      params: { startDate, endDate },
    });
    return data.data;
  },

  getSuggestion: async (exerciseId: string) => {
    const { data } = await apiClient.get(
      `/sessions/exercises/${exerciseId}/suggestion`
    );
    return data.data;
  },
};
