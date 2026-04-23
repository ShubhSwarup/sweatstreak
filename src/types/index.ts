// ─── Auth ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// ─── Exercise ────────────────────────────────────────────────────────────────
export type ExerciseType = 'strength' | 'cardio';
export type TrackingType = 'reps' | 'time' | 'distance';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  secondaryMuscles?: string[];
  exerciseType: ExerciseType;
  trackingType: TrackingType;
  description?: string;
}

export interface ExerciseStats {
  lastWeight?: number;
  lastReps?: number;
  bestWeight?: number;
  bestReps?: number;
  estimated1RM?: number;
  totalVolume?: number;
  totalSets?: number;
}

// ─── Template ────────────────────────────────────────────────────────────────
export interface TemplateExercise {
  exercise: string; // exercise id
  exerciseName: string;
  order: number;
  sets: number;
  repRange?: { min: number; max: number };
  restSeconds: number;
  notes?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean;
  isGenerated?: boolean;
  isPlanTemplate?: boolean;
  exercises: TemplateExercise[];
  estimatedDuration?: string;
  muscleGroups?: string[];
}

// ─── Session ─────────────────────────────────────────────────────────────────
export type SessionStatus = 'active' | 'paused' | 'completed' | 'discarded';

export interface SetData {
  id: string;
  setNumber: number;
  weight?: number | null;
  reps?: number | null;
  durationSeconds?: number | null;
  distance?: number | null;
  rpe?: number | null;
  completed: boolean;
  isPR: boolean;
}

export interface SessionExercise {
  exerciseId: string;
  name: string;
  exerciseType: ExerciseType;
  trackingType?: TrackingType;
  order: number;
  notes?: string;
  restSeconds: number;
  lastPerformance?: { weight: number; reps: number } | null;
  bestPerformance?: { weight: number; reps: number } | null;
  suggestion?: { weight: number; reps?: number; action: 'increase' | 'hold' | 'decrease' } | null;
  sets: SetData[];
  summary?: { bestWeight: number; bestReps: number; volume: number; setCount: number };
}

export interface WorkoutSession {
  id: string;
  name: string;
  status: SessionStatus;
  startedAt: string;
  endedAt?: string;
  durationSeconds?: number;
  exercises: SessionExercise[];
  template?: string;
  isPlanWorkout?: boolean;
  sessionSummary?: {
    totalVolume: number;
    totalSets: number;
    totalExercises: number;
    personalRecords?: PersonalRecord[];
  };
}

export interface PersonalRecord {
  exercise: string;
  exerciseName?: string;
  type: 'weight' | '1rm' | 'volume' | 'distance' | 'time';
  value: number;
}

export interface FinishSessionResult {
  summary: { totalVolume: number; totalSets: number; totalExercises: number; duration: number };
  xp: { earned: number; total: number };
  streak: { current: number; continued: boolean };
  personalRecords: PersonalRecord[];
  message: string;
}

// ─── Plan ────────────────────────────────────────────────────────────────────
export type PlanDayType = 'workout' | 'rest';

export interface PlanDay {
  order: number;
  type: PlanDayType;
  label?: string;
  template?: WorkoutTemplate | null;
  templateId?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  days: PlanDay[];
  currentDayIndex: number;
  totalDays: number;
  isActive: boolean;
  lastCompletedAt?: string;
}

export interface TodayPlan {
  planId: string;
  planName: string;
  currentIndex: number;
  totalDays: number;
  skippedDays: number;
  today: {
    type: PlanDayType;
    label?: string;
    template?: WorkoutTemplate | null;
  };
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export interface DashboardData {
  streak: { current: number; longest: number };
  xp: { total: number; level: number };
  lastWorkout: { name: string; date: string; duration: number; volume: number } | null;
  weeklyVolume: number;
  volumeByDay: Record<string, number>;
  topExercises: { exerciseId: string; name: string; volume: number }[];
  todayPlan: TodayPlan | null;
  isFirstTimeUser: boolean;
}

// ─── Workout Hub ─────────────────────────────────────────────────────────────
export type HubMode = 'default' | 'quickStart' | 'plan' | 'swap' | 'resume' | 'empty';

export interface HubContext {
  mode: HubMode;
  templateId?: string;
  planId?: string;
  replacingName?: string;
  source?: 'tab' | 'dashboard';
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: { total: number; page: number; pages: number; limit: number };
}
