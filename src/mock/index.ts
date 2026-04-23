import type { Exercise, WorkoutTemplate, PastSession, WorkoutPlan, DashboardData, ActiveSession } from '../types';

// ─────────────────────────────────────────────
// MOCK EXERCISES
// ─────────────────────────────────────────────
export const MOCK_EXERCISES: Exercise[] = [
  { _id: 'ex_001', name: 'Bench Press', muscleGroup: 'Chest', exerciseType: 'strength', trackingType: 'reps', isSystem: true, description: 'Classic flat bench barbell press.' },
  { _id: 'ex_002', name: 'Overhead Press', muscleGroup: 'Shoulders', exerciseType: 'strength', trackingType: 'reps', isSystem: true },
  { _id: 'ex_003', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', exerciseType: 'strength', trackingType: 'reps', isSystem: true },
  { _id: 'ex_004', name: 'Lateral Raises', muscleGroup: 'Shoulders', exerciseType: 'strength', trackingType: 'reps', isSystem: true },
  { _id: 'ex_005', name: 'Tricep Pushdown', muscleGroup: 'Arms', exerciseType: 'strength', trackingType: 'reps', isSystem: true },
  { _id: 'ex_006', name: 'Skull Crushers', muscleGroup: 'Arms', exerciseType: 'strength', trackingType: 'reps', isSystem: true },
  { _id: 'ex_007', name: 'Squat', muscleGroup: 'Quads', exerciseType: 'strength', trackingType: 'reps', isSystem: true },
  { _id: 'ex_008', name: 'Romanian Deadlift', muscleGroup: 'Hamstrings', exerciseType: 'strength', trackingType: 'reps', isSystem: true },
  { _id: 'ex_009', name: 'Leg Press', muscleGroup: 'Quads', exerciseType: 'strength', trackingType: 'reps', isSystem: true },
  { _id: 'ex_010', name: 'Leg Curl', muscleGroup: 'Hamstrings', exerciseType: 'strength', trackingType: 'reps', isSystem: true },
  { _id: 'ex_011', name: 'Hip Thrust', muscleGroup: 'Glutes', exerciseType: 'strength', trackingType: 'reps', isSystem: true },
  { _id: 'ex_012', name: 'Pull-ups', muscleGroup: 'Back', exerciseType: 'strength', trackingType: 'reps', isSystem: true },
  { _id: 'ex_013', name: 'Bent-over Row', muscleGroup: 'Back', exerciseType: 'strength', trackingType: 'reps', isSystem: true },
  { _id: 'ex_014', name: 'Deadlift', muscleGroup: 'Back', exerciseType: 'strength', trackingType: 'reps', isSystem: true },
  { _id: 'ex_015', name: 'Bicep Curl', muscleGroup: 'Arms', exerciseType: 'strength', trackingType: 'reps', isSystem: true },
  { _id: 'ex_016', name: 'Cable Fly', muscleGroup: 'Chest', exerciseType: 'strength', trackingType: 'reps', isSystem: true },
  { _id: 'ex_017', name: 'Plank', muscleGroup: 'Core', exerciseType: 'strength', trackingType: 'time', isSystem: true },
  { _id: 'ex_018', name: 'Running', muscleGroup: 'Cardio', exerciseType: 'cardio', trackingType: 'distance', isSystem: true },
  { _id: 'ex_019', name: 'Cycling', muscleGroup: 'Cardio', exerciseType: 'cardio', trackingType: 'time', isSystem: true },
  { _id: 'ex_020', name: 'Rowing Machine', muscleGroup: 'Cardio', exerciseType: 'cardio', trackingType: 'distance', isSystem: true },
];

// ─────────────────────────────────────────────
// MOCK TEMPLATES
// ─────────────────────────────────────────────
export const MOCK_TEMPLATES: WorkoutTemplate[] = [
  {
    _id: 'tpl_001',
    name: 'Upper Body Power',
    description: 'Strength-focused upper body session targeting chest, shoulders, and triceps.',
    isSystem: false,
    exerciseCount: 6,
    estimatedDuration: '55 min',
    muscleGroups: ['Chest', 'Shoulders', 'Arms'],
    exercises: [
      { exercise: 'ex_001', order: 1, sets: 4, repRange: { min: 6, max: 8 }, restSeconds: 90 },
      { exercise: 'ex_002', order: 2, sets: 3, repRange: { min: 8, max: 10 }, restSeconds: 90 },
      { exercise: 'ex_003', order: 3, sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 60 },
      { exercise: 'ex_004', order: 4, sets: 3, repRange: { min: 12, max: 15 }, restSeconds: 60 },
      { exercise: 'ex_005', order: 5, sets: 3, repRange: { min: 12, max: 15 }, restSeconds: 60 },
      { exercise: 'ex_006', order: 6, sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 60 },
    ],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    _id: 'tpl_002',
    name: 'Legs & Glutes ISO',
    description: 'Complete lower body session with focus on quad and glute isolation.',
    isSystem: false,
    exerciseCount: 5,
    estimatedDuration: '60 min',
    muscleGroups: ['Quads', 'Hamstrings', 'Glutes'],
    exercises: [
      { exercise: 'ex_007', order: 1, sets: 4, repRange: { min: 6, max: 8 }, restSeconds: 120 },
      { exercise: 'ex_008', order: 2, sets: 3, repRange: { min: 8, max: 10 }, restSeconds: 90 },
      { exercise: 'ex_009', order: 3, sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 90 },
      { exercise: 'ex_010', order: 4, sets: 3, repRange: { min: 12, max: 15 }, restSeconds: 60 },
      { exercise: 'ex_011', order: 5, sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 60 },
    ],
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    _id: 'tpl_003',
    name: 'Push Day',
    isSystem: true,
    exerciseCount: 6,
    estimatedDuration: '50 min',
    muscleGroups: ['Chest', 'Shoulders', 'Arms'],
    exercises: [],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    _id: 'tpl_004',
    name: 'Pull Day',
    isSystem: true,
    exerciseCount: 5,
    estimatedDuration: '45 min',
    muscleGroups: ['Back', 'Arms'],
    exercises: [],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    _id: 'tpl_005',
    name: 'Full Body Strength',
    isSystem: true,
    exerciseCount: 7,
    estimatedDuration: '65 min',
    muscleGroups: ['Chest', 'Back', 'Legs'],
    exercises: [],
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// ─────────────────────────────────────────────
// MOCK ACTIVE SESSION
// ─────────────────────────────────────────────
export const MOCK_ACTIVE_SESSION: ActiveSession = {
  id: 'session_active_001',
  name: 'Upper Body Power',
  startedAt: new Date(Date.now() - 1842000).toISOString(),
  durationSeconds: 1842,
  status: 'active',
  isPlanWorkout: true,
  exercises: [
    {
      exerciseId: 'ex_001',
      name: 'Bench Press',
      exerciseType: 'strength',
      trackingType: 'reps',
      restSeconds: 90,
      lastPerformance: { weight: 80, reps: 7 },
      suggestion: { weight: 82.5, reps: 8, action: 'increase' },
      sets: [
        { setNumber: 1, weight: 82.5, reps: 8, completed: true, isPR: true },
        { setNumber: 2, weight: 82.5, reps: 7, completed: true, isPR: false },
        { setNumber: 3, weight: 82.5, reps: 6, completed: true, isPR: false },
        { setNumber: 4, weight: null, reps: null, completed: false, isPR: false },
      ],
    },
    {
      exerciseId: 'ex_002',
      name: 'Overhead Press',
      exerciseType: 'strength',
      trackingType: 'reps',
      restSeconds: 90,
      lastPerformance: { weight: 55, reps: 8 },
      suggestion: { weight: 55, reps: 8, action: 'hold' },
      sets: [
        { setNumber: 1, weight: 55, reps: 8, completed: true, isPR: false },
        { setNumber: 2, weight: null, reps: null, completed: false, isPR: false },
        { setNumber: 3, weight: null, reps: null, completed: false, isPR: false },
      ],
    },
    {
      exerciseId: 'ex_003',
      name: 'Incline Dumbbell Press',
      exerciseType: 'strength',
      trackingType: 'reps',
      restSeconds: 60,
      lastPerformance: null,
      suggestion: null,
      sets: [
        { setNumber: 1, weight: null, reps: null, completed: false, isPR: false },
        { setNumber: 2, weight: null, reps: null, completed: false, isPR: false },
        { setNumber: 3, weight: null, reps: null, completed: false, isPR: false },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// MOCK PAST SESSIONS
// ─────────────────────────────────────────────
export const MOCK_PAST_SESSIONS: PastSession[] = [
  {
    _id: 'session_001',
    name: 'Push Hypertrophy',
    startedAt: '2024-01-13T10:00:00Z',
    endedAt: '2024-01-13T10:54:00Z',
    durationSeconds: 3240,
    sessionSummary: {
      totalVolume: 12450,
      totalSets: 18,
      totalExercises: 6,
      personalRecords: [
        { exercise: 'ex_001', exerciseName: 'Bench Press', type: 'weight', value: 82.5 },
      ],
    },
  },
  {
    _id: 'session_002',
    name: 'Legs & Glutes ISO',
    startedAt: '2024-01-10T09:00:00Z',
    endedAt: '2024-01-10T10:02:00Z',
    durationSeconds: 3720,
    sessionSummary: {
      totalVolume: 16800,
      totalSets: 16,
      totalExercises: 5,
      personalRecords: [],
    },
  },
];

// ─────────────────────────────────────────────
// MOCK WORKOUT PLAN
// ─────────────────────────────────────────────
export const MOCK_PLAN: WorkoutPlan = {
  _id: 'plan_001',
  name: '8-Week Hypertrophy',
  currentDayIndex: 3,
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  days: [
    { order: 1, type: 'workout', label: 'Upper Body A' },
    { order: 2, type: 'rest', label: 'Rest' },
    { order: 3, type: 'workout', label: 'Lower Body' },
    { order: 4, type: 'workout', label: 'Upper Body B' },
    { order: 5, type: 'rest', label: 'Rest' },
    { order: 6, type: 'workout', label: 'Full Body' },
    { order: 7, type: 'rest', label: 'Rest' },
  ],
};

// ─────────────────────────────────────────────
// MOCK DASHBOARD DATA
// ─────────────────────────────────────────────
export const MOCK_DASHBOARD: DashboardData = {
  streak: { current: 14, longest: 21 },
  xp: { total: 3200, level: 8 },
  lastWorkout: {
    name: 'Push Hypertrophy',
    date: '2 days ago',
    duration: 3240,
    volume: 12450,
  },
  weeklyVolume: 45200,
  volumeByDay: {
    '2024-01-08': 8400,
    '2024-01-09': 12200,
    '2024-01-10': 0,
    '2024-01-11': 9800,
    '2024-01-12': 14800,
    '2024-01-13': 0,
    '2024-01-14': 0,
  },
  topExercises: [
    { exerciseId: 'ex_001', name: 'Bench Press', volume: 4800 },
    { exerciseId: 'ex_007', name: 'Squat', volume: 3200 },
    { exerciseId: 'ex_014', name: 'Deadlift', volume: 2900 },
  ],
  todayPlan: {
    planId: 'plan_001',
    planName: '8-Week Hypertrophy',
    currentIndex: 3,
    totalDays: 28,
    today: {
      type: 'workout',
      label: 'Upper Body B',
      template: MOCK_TEMPLATES[0],
    },
    skippedDays: 0,
  },
  isFirstTimeUser: false,
};

export const MOCK_DASHBOARD_FTU: DashboardData = {
  ...MOCK_DASHBOARD,
  lastWorkout: null,
  weeklyVolume: 0,
  volumeByDay: {},
  topExercises: [],
  todayPlan: null,
  isFirstTimeUser: true,
};

export const MOCK_DASHBOARD_REST: DashboardData = {
  ...MOCK_DASHBOARD,
  todayPlan: {
    planId: 'plan_001',
    planName: '8-Week Hypertrophy',
    currentIndex: 4,
    totalDays: 28,
    today: {
      type: 'rest',
      label: 'Rest',
      template: null,
    },
    skippedDays: 0,
  },
};

export const MOCK_CALENDAR: Record<string, { hasPR: boolean; workouts: string[]; totalVolume: number }> = {
  '2024-01-01': { hasPR: false, workouts: ['Push Day'], totalVolume: 8200 },
  '2024-01-03': { hasPR: true, workouts: ['Legs & Glutes ISO'], totalVolume: 14500 },
  '2024-01-05': { hasPR: false, workouts: ['Pull Day'], totalVolume: 9800 },
  '2024-01-08': { hasPR: false, workouts: ['Upper Body Power'], totalVolume: 11200 },
  '2024-01-10': { hasPR: true, workouts: ['Full Body Strength'], totalVolume: 16800 },
  '2024-01-12': { hasPR: false, workouts: ['Push Day'], totalVolume: 10400 },
  '2024-01-13': { hasPR: true, workouts: ['Upper Body Power'], totalVolume: 12450 },
};
