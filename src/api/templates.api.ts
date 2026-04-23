import apiClient from './client';
import type { WorkoutTemplate } from '../types';
import { mapWorkoutTemplate } from './mappers';

export const templatesApi = {
  getTemplates: async (params?: { type?: 'system' | 'user' | 'all'; search?: string; page?: number; limit?: number }) => {
    const { data } = await apiClient.get<{
      success: boolean;
      data: Record<string, unknown>[];
      pagination: { total: number; page: number; pages: number; limit: number };
    }>('/templates', { params });
    const templates = (data.data ?? []).map((row) => mapWorkoutTemplate(row));
    return { templates, pagination: data.pagination };
  },

  getTemplateById: async (templateId: string): Promise<WorkoutTemplate> => {
    const { data } = await apiClient.get<{ success: boolean; data: Record<string, unknown> }>(
      `/templates/${templateId}`
    );
    return mapWorkoutTemplate(data.data);
  },

  createTemplate: async (payload: Partial<WorkoutTemplate>): Promise<WorkoutTemplate> => {
    const { data } = await apiClient.post('/templates', payload);
    return mapWorkoutTemplate(data.data as Record<string, unknown>);
  },

  updateTemplate: async (templateId: string, payload: Partial<WorkoutTemplate>): Promise<WorkoutTemplate> => {
    const { data } = await apiClient.put(`/templates/${templateId}`, payload);
    return mapWorkoutTemplate(data.data as Record<string, unknown>);
  },

  deleteTemplate: async (templateId: string): Promise<void> => {
    await apiClient.delete(`/templates/${templateId}`);
  },
};
