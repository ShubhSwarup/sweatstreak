import apiClient from './client';
import type { DashboardData } from '../types';
import { mapDashboardPayload } from './mappers';

export const dashboardApi = {
  getDashboard: async (_userId?: string): Promise<DashboardData> => {
    const { data } = await apiClient.get<{ success: boolean; data: Record<string, unknown> }>('/dashboard');
    return mapDashboardPayload(data.data);
  },
};
