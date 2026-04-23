// ─────────────────────────────────────────────
// 🔧 CONFIGURATION — update BASE_URL for your environment
// ─────────────────────────────────────────────

export const API_CONFIG = {
  /** Backend base (must include `/api`). iOS Simulator: `http://127.0.0.1:5000/api`. Physical device: your machine's LAN IP. */
  BASE_URL: 'http://192.168.0.104:5000/api',

  TIMEOUT: 10000, // 10 seconds

  ENDPOINTS: {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',

    // Dashboard
    DASHBOARD: '/dashboard',

    // Sessions
    SESSIONS: '/sessions',
    SESSION_START: '/sessions/start',
    SESSION_ACTIVE: '/sessions/active',
    SESSION_FINISH: (id: string) => `/sessions/${id}/finish`,
    SESSION_PAUSE: (id: string) => `/sessions/${id}/pause`,
    SESSION_RESUME: (id: string) => `/sessions/${id}/resume`,
    SESSION_DISCARD: (id: string) => `/sessions/${id}/discard`,
    SESSION_ADD_EXERCISE: (id: string) => `/sessions/${id}/exercises`,
    SESSION_REMOVE_EXERCISE: (id: string, index: number) => `/sessions/${id}/exercises/${index}`,
    SESSION_ADD_SET: (id: string) => `/sessions/${id}/sets`,
    SESSION_CALENDAR: '/sessions/calendar',
    SESSION_BY_ID: (id: string) => `/sessions/${id}`,

    // Exercises
    EXERCISES: '/exercises',
    EXERCISE_BY_ID: (id: string) => `/exercises/${id}`,
    EXERCISE_SUGGESTED: '/exercises/suggested',
    EXERCISE_LAST_PERFORMANCE: (id: string) => `/sessions/exercises/${id}/last-performance`,
    EXERCISE_SUGGESTION: (id: string) => `/sessions/exercises/${id}/suggestion`,

    // Templates
    TEMPLATES: '/templates',
    TEMPLATE_BY_ID: (id: string) => `/templates/${id}`,

    // Workout Plans
    PLANS: '/workoutPlan',
    PLAN_ACTIVE: '/workoutPlan/active',
    PLAN_TODAY: '/workoutPlan/today',
    PLAN_SKIP: '/workoutPlan/skip',
    PLAN_RESTART: '/workoutPlan/restart',

    // Progression
    PROGRESSION: (exerciseId: string) => `/progression/${exerciseId}`,

    // XP
    XP: '/xp',

    // Streak
    STREAK: '/streak',

    // Analytics
    ANALYTICS: '/analytics',
  },
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'sweatstreak_access_token',
  REFRESH_TOKEN: 'sweatstreak_refresh_token',
  USER: 'sweatstreak_user',
} as const;
