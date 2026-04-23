import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '../api/auth.api';
import type { User } from '../types';
import { STORAGE_KEYS } from '@/constants/config';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  error: null,

  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        // TODO: optionally call /api/me to validate token and get fresh user data
        const userJson = await SecureStore.getItemAsync(STORAGE_KEYS.USER);
        const user = userJson ? JSON.parse(userJson) : null;
        set({ user, isLoggedIn: !!user, isLoading: false });
      } else {
        set({ isLoggedIn: false, isLoading: false });
      }
    } catch {
      set({ isLoggedIn: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authApi.login({ email, password });
      await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, result.accessToken);
      await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, result.refreshToken);
      await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(result.user));
      set({ user: result.user, isLoggedIn: true, isLoading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Login failed', isLoading: false });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authApi.register({ name, email, password });
      await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, result.accessToken);
      await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, result.refreshToken);
      await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(result.user));
      set({ user: result.user, isLoggedIn: true, isLoading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Registration failed', isLoading: false });
    }
  },

  logout: async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) await authApi.logout(refreshToken);
    } catch { }
    await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
    set({ user: null, isLoggedIn: false });
  },

  clearError: () => set({ error: null }),
}));
