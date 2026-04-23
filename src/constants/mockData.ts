import type { Exercise, WorkoutTemplate, WorkoutSession, WorkoutPlan, DashboardData } from '../types';

export const MOCK_EXERCISES: Exercise[] = [
  { id: 'ex_001', name: 'Bench Press', muscleGroup: 'Chest', secondaryMuscles: ['Shoulders', 'Triceps'], exerciseType: 'strength', trackingType: 'reps' },
  { id: 'ex_002', name: 'Overhead Press', muscleGroup: 'Shoulders', secondaryMuscles: ['Triceps'], exerciseType: 'strength', trackingType: 'reps' },
  { id: 'ex_003', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', exerciseType: 'strength', trackingType: 'reps' },
  { id: 'ex_004', name: 'Lateral Raises', muscleGroup: 'Shoulders', exerciseType: 'strength', trackingType: 'reps' },
  { id: 'ex_005', name: 'Tricep Pushdown', muscleGroup: 'Triceps', exerciseType: 'strength', trackingType: 'reps' },
  { id: 'ex_006', name: 'Skull Crushers', muscleGroup: 'Triceps', exerciseType: 'strength', trackingType: 'reps' },
  { id: 'ex_007', name: 'Squat', muscleGroup: 'Quads', secondaryMuscles: ['Glutes', 'Hamstrings'], exerciseType: 'strength', trackingType: 'reps' },
  { id: 'ex_008', name: 'Romanian Deadlift', muscleGroup: 'Hamstrings', secondaryMuscles: ['Glutes'], exerciseType: 'strength', trackingType: 'reps' },
  { id: 'ex_009', name: 'Leg Press', muscleGroup: 'Quads', exerciseType: 'strength', trackingType: 'reps' },
  { id: 'ex_010', name: 'Leg Curl', muscleGroup: 'Hamstrings', exerciseType: 'strength', trackingType: 'reps' },
  { id: 'ex_011', name: 'Hip Thrust', muscleGroup: 'Glutes', exerciseType: 'strength', trackingType: 'reps' },
  { id: 'ex_012', name: 'Deadlift', muscleGroup: 'Back', secondaryMuscles: ['Legs', 'Core'], exerciseType: 'strength', trackingType: 'reps' },
  { id: 'ex_013', name: 'Bent-over Row', muscleGroup: 'Back', secondaryMuscles: ['Biceps'], exerciseType: 'strength', trackingType: 'reps' },
  { id: 'ex_014', name: 'Pull-ups', muscleGroup: 'Back', secondaryMuscles: ['Biceps'], exerciseType: 'strength', trackingType: 'reps' },
  { id: 'ex_015', name: 'Bicep Curl', muscleGroup: 'Biceps', exerciseType: 'strength', trackingType: 'reps' },
  { id: 'ex_016', name: 'Cable Fly', muscleGroup: 'Chest', exerciseType: 'strength', trackingType: 'reps' },
  { id: 'ex_017', name: 'Running', muscleGroup: 'Cardio', exerciseType: 'cardio', trackingType: 'distance' },
  { id: 'ex_018', name: 'Cycling', muscleGroup: 'Cardio', exerciseType: 'cardio', trackingType: 'time' },
];

export const MOCK_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'tmpl_001', name: 'Upper Body Power', isSystem: false,
    estimatedDuration: '55 min', muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    exercises: [
      { exercise: 'ex_001', exerciseName: 'Bench Press', order: 1, sets: 4, repRange: { min: 6, max: 8 }, restSeconds: 90 },
      { exercise: 'ex_002', exerciseName: 'Overhead Press', order: 2, sets: 3, repRange: { min: 8, max: 10 }, restSeconds: 90 },
      { exercise: 'ex_003', exerciseName: 'Incline Dumbbell Press', order: 3, sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 60 },
      { exercise: 'ex_004', exerciseName: 'Lateral Raises', order: 4, sets: 3, repRange: { min: 12, max: 15 }, restSeconds: 60 },
      { exercise: 'ex_005', exerciseName: 'Tricep Pushdown', order: 5, sets: 3, repRange: { min: 12, max: 15 }, restSeconds: 60 },
    ],
  },
  {
    id: 'tmpl_002', name: 'Legs & Glutes ISO', isSystem: false,
    estimatedDuration: '60 min', muscleGroups: ['Quads', 'Hamstrings', 'Glutes'],
    exercises: [
      { exercise: 'ex_007', exerciseName: 'Squat', order: 1, sets: 4, repRange: { min: 6, max: 8 }, restSeconds: 120 },
      { exercise: 'ex_008', exerciseName: 'Romanian Deadlift', order: 2, sets: 3, repRange: { min: 8, max: 10 }, restSeconds: 90 },
      { exercise: 'ex_009', exerciseName: 'Leg Press', order: 3, sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 90 },
      { exercise: 'ex_010', exerciseName: 'Leg Curl', order: 4, sets: 3, repRange: { min: 12, max: 15 }, restSeconds: 60 },
      { exercise: 'ex_011', exerciseName: 'Hip Thrust', order: 5, sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 60 },
    ],
  },
  {
    id: 'tmpl_003', name: 'Push Day', isSystem: true,
    estimatedDuration: '50 min', muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    exercises: [
      { exercise: 'ex_001', exerciseName: 'Bench Press', order: 1, sets: 4, repRange: { min: 6, max: 8 }, restSeconds: 90 },
      { exercise: 'ex_002', exerciseName: 'Overhead Press', order: 2, sets: 3, repRange: { min: 8, max: 10 }, restSeconds: 90 },
      { exercise: 'ex_016', exerciseName: 'Cable Fly', order: 3, sets: 3, repRange: { min: 12, max: 15 }, restSeconds: 60 },
      { exercise: 'ex_005', exerciseName: 'Tricep Pushdown', order: 4, sets: 3, repRange: { min: 12, max: 15 }, restSeconds: 60 },
    ],
  },
  {
    id: 'tmpl_004', name: 'Pull Day', isSystem: true,
    estimatedDuration: '45 min', muscleGroups: ['Back', 'Biceps'],
    exercises: [
      { exercise: 'ex_012', exerciseName: 'Deadlift', order: 1, sets: 3, repRange: { min: 5, max: 6 }, restSeconds: 180 },
      { exercise: 'ex_014', exerciseName: 'Pull-ups', order: 2, sets: 3, repRange: { min: 8, max: 10 }, restSeconds: 90 },
      { exercise: 'ex_013', exerciseName: 'Bent-over Row', order: 3, sets: 3, repRange: { min: 8, max: 10 }, restSeconds: 90 },
      { exercise: 'ex_015', exerciseName: 'Bicep Curl', order: 4, sets: 3, repRange: { min: 12, max: 15 }, restSeconds: 60 },
    ],
  },
  {
    id: 'tmpl_005', name: 'Full Body Strength', isSystem: true,
    estimatedDuration: '65 min', muscleGroups: ['Chest', 'Back', 'Legs'],
    exercises: [
      { exercise: 'ex_007', exerciseName: 'Squat', order: 1, sets: 3, repRange: { min: 5, max: 6 }, restSeconds: 180 },
      { exercise: 'ex_001', exerciseName: 'Bench Press', order: 2, sets: 3, repRange: { min: 6, max: 8 }, restSeconds: 120 },
      { exercise: 'ex_012', exerciseName: 'Deadlift', order: 3, sets: 3, repRange: { min: 5, max: 6 }, restSeconds: 180 },
      { exercise: 'ex_002', exerciseName: 'Overhead Press', order: 4, sets: 3, repRange: { min: 8, max: 10 }, restSeconds: 90 },
    ],
  },
];

export const MOCK_ACTIVE_SESSION: WorkoutSession = {
  id: 'session_active_001',
  name: 'Upper Body Power',
  status: 'active',
  startedAt: new Date(Date.now() - 1842000).toISOString(),
  exercises: [
    {
      exerciseId: 'ex_001', name: 'Bench Press', exerciseType: 'strength', trackingType: 'reps',
      order: 1, restSeconds: 90,
      lastPerformance: { weight: 80, reps: 7 },
      bestPerformance: { weight: 80, reps: 8 },
      suggestion: { weight: 82.5, reps: 8, action: 'increase' },
      sets: [
        { setNumber: 1, weight: 82.5, reps: 8, completed: true, isPR: true },
        { setNumber: 2, weight: 82.5, reps: 7, completed: true, isPR: false },
        { setNumber: 3, weight: 82.5, reps: 6, completed: true, isPR: false },
        { setNumber: 4, weight: null, reps: null, completed: false, isPR: false },
      ],
    },
    {
      exerciseId: 'ex_002', name: 'Overhead Press', exerciseType: 'strength', trackingType: 'reps',
      order: 2, restSeconds: 90,
      lastPerformance: { weight: 55, reps: 8 },
      suggestion: { weight: 55, reps: 8, action: 'hold' },
      sets: [
        { setNumber: 1, weight: 55, reps: 8, completed: true, isPR: false },
        { setNumber: 2, weight: null, reps: null, completed: false, isPR: false },
        { setNumber: 3, weight: null, reps: null, completed: false, isPR: false },
      ],
    },
    {
      exerciseId: 'ex_003', name: 'Incline Dumbbell Press', exerciseType: 'strength', trackingType: 'reps',
      order: 3, restSeconds: 60,
      lastPerformance: null, suggestion: null,
      sets: [
        { setNumber: 1, weight: null, reps: null, completed: false, isPR: false },
        { setNumber: 2, weight: null, reps: null, completed: false, isPR: false },
        { setNumber: 3, weight: null, reps: null, completed: false, isPR: false },
      ],
    },
  ],
};

export const MOCK_PLAN: WorkoutPlan = {
  id: 'plan_001', name: '8-Week Hypertrophy',
  currentDayIndex: 3, totalDays: 28, isActive: true,
  lastCompletedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  days: [
    { order: 1, type: 'workout', label: 'Upper Body A', templateId: 'tmpl_001' },
    { order: 2, type: 'rest', label: 'Rest' },
    { order: 3, type: 'workout', label: 'Lower Body', templateId: 'tmpl_002' },
    { order: 4, type: 'workout', label: 'Upper Body B', templateId: 'tmpl_003' },
    { order: 5, type: 'rest', label: 'Rest' },
    { order: 6, type: 'workout', label: 'Full Body', templateId: 'tmpl_005' },
    { order: 7, type: 'rest', label: 'Rest' },
  ],
};

export const MOCK_DASHBOARD: DashboardData = {
  streak: { current: 14, longest: 21 },
  xp: { total: 3200, level: 8 },
  lastWorkout: { name: 'Push Hypertrophy', date: '2024-01-13T18:30:00Z', duration: 3240, volume: 12450 },
  weeklyVolume: 45200,
  volumeByDay: {
    '2024-01-08': 8400, '2024-01-09': 12200, '2024-01-10': 0,
    '2024-01-11': 9800, '2024-01-12': 14800, '2024-01-13': 0, '2024-01-14': 0,
  },
  topExercises: [
    { exerciseId: 'ex_001', name: 'Bench Press', volume: 4800 },
    { exerciseId: 'ex_007', name: 'Squat', volume: 3200 },
    { exerciseId: 'ex_012', name: 'Deadlift', volume: 2900 },
  ],
  todayPlan: {
    planId: 'plan_001', planName: '8-Week Hypertrophy',
    currentIndex: 3, totalDays: 28, skippedDays: 0,
    today: { type: 'workout', label: 'Upper Body B', template: MOCK_TEMPLATES[2] },
  },
  isFirstTimeUser: false,
};

export const MOCK_CALENDAR: Record<string, { hasPR: boolean; workouts: { name: string; duration: number }[]; totalVolume: number }> = {
  '2024-01-01': { hasPR: false, workouts: [{ name: 'Push Day', duration: 2880 }], totalVolume: 8200 },
  '2024-01-03': { hasPR: true, workouts: [{ name: 'Legs & Glutes ISO', duration: 3600 }], totalVolume: 14500 },
  '2024-01-05': { hasPR: false, workouts: [{ name: 'Pull Day', duration: 2700 }], totalVolume: 9800 },
  '2024-01-08': { hasPR: false, workouts: [{ name: 'Upper Body Power', duration: 3240 }], totalVolume: 11200 },
  '2024-01-10': { hasPR: true, workouts: [{ name: 'Full Body Strength', duration: 3900 }], totalVolume: 16800 },
  '2024-01-12': { hasPR: false, workouts: [{ name: 'Push Day', duration: 2940 }], totalVolume: 10400 },
  '2024-01-15': { hasPR: true, workouts: [{ name: 'Upper Body Power', duration: 3240 }], totalVolume: 12450 },
};

export const MOCK_EXERCISE_HISTORY: Record<string, { date: string; weight: number }[]> = {
  'ex_001': [
    { date: 'Dec 1', weight: 70 }, { date: 'Dec 8', weight: 72.5 },
    { date: 'Dec 15', weight: 75 }, { date: 'Dec 22', weight: 77.5 },
    { date: 'Jan 1', weight: 77.5 }, { date: 'Jan 8', weight: 80 },
    { date: 'Jan 15', weight: 82.5 },
  ],
};
