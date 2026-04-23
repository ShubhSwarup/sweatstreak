import apiClient from './client';
import type { User } from '../types';

export interface LoginPayload { email: string; password: string }
export interface RegisterPayload { name: string; email: string; password: string }
export interface AuthResponse { user: User; accessToken: string; refreshToken: string }

// ─── TODO: Replace mock returns with real API calls ───────────────────────────
// Each function shows the real call commented out alongside the mock return.

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', payload);
    return data;
    // MOCK: return { user: { id: '1', name: 'Alex', email: payload.email }, accessToken: 'mock', refreshToken: 'mock' };
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/auth/logout', { refreshToken });
  },

  refreshToken: async (refreshToken: string) => {
    const { data } = await apiClient.post('/auth/refresh-token', { refreshToken });
    return data;
  },
};
