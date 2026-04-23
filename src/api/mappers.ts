import type {
  DashboardData,
  Exercise,
  FinishSessionResult,
  PlanDay,
  SessionExercise,
  SessionStatus,
  SetData,
  TodayPlan,
  WorkoutPlan,
  WorkoutSession,
  WorkoutTemplate,
} from '../types';

function oid(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'object' && v !== null && '_id' in v) {
    return String((v as { _id: unknown })._id);
  }
  return String(v);
}

export function mapExercise(doc: Record<string, unknown>): Exercise {
  return {
    id: oid(doc._id ?? doc.id),
    name: String(doc.name ?? ''),
    muscleGroup: String(doc.muscleGroup ?? ''),
    secondaryMuscles: (doc.secondaryMuscles as string[] | undefined) ?? undefined,
    exerciseType: (doc.exerciseType as Exercise['exerciseType']) ?? 'strength',
    trackingType: (doc.trackingType as Exercise['trackingType']) ?? 'reps',
    description: doc.description as string | undefined,
  };
}

export function mapWorkoutTemplate(doc: Record<string, unknown> | null | undefined): WorkoutTemplate {
  if (!doc) {
    return { id: '', name: '', isSystem: false, exercises: [] };
  }
  const exercises = ((doc.exercises as unknown[]) ?? []).map((row) => {
    const r = row as Record<string, unknown>;
    const exRef = r.exercise;
    const exerciseId = oid(exRef);
    const exerciseName =
      typeof exRef === 'object' && exRef !== null && 'name' in exRef
        ? String((exRef as { name: unknown }).name)
        : '';
    const repRange = r.repRange as { min?: number; max?: number } | undefined;
    return {
      exercise: exerciseId,
      exerciseName,
      order: Number(r.order ?? 0),
      sets: typeof r.sets === 'number' ? r.sets : 3,
      repRange:
        repRange?.min != null && repRange?.max != null
          ? { min: repRange.min, max: repRange.max }
          : undefined,
      restSeconds: typeof r.restSeconds === 'number' ? r.restSeconds : 90,
      notes: r.notes as string | undefined,
    };
  });

  return {
    id: oid(doc._id ?? doc.id),
    name: String(doc.name ?? ''),
    description: doc.description as string | undefined,
    isSystem: !!doc.isSystem,
    isGenerated: !!doc.isGenerated,
    isPlanTemplate: !!doc.isPlanTemplate,
    exercises,
    muscleGroups: doc.muscleGroups as string[] | undefined,
    estimatedDuration: doc.estimatedDuration as string | undefined,
  };
}

function mapSet(s: Record<string, unknown>): SetData {
  return {
    setNumber: Number(s.setNumber ?? 0),
    weight: s.weight as number | null | undefined,
    reps: s.reps as number | null | undefined,
    durationSeconds: s.durationSeconds as number | null | undefined,
    distance: s.distance as number | null | undefined,
    rpe: s.rpe as number | null | undefined,
    completed: !!s.completed,
    isPR: !!s.isPR,
  };
}

export function mapSessionExercise(ex: Record<string, unknown>, idx: number): SessionExercise {
  const setsRaw = (ex.sets as unknown[]) ?? [];
  const sets: SetData[] = setsRaw.map((s) => mapSet(s as Record<string, unknown>));

  return {
    exerciseId: oid(ex.exerciseId ?? ex.exercise),
    name: String(ex.name ?? ''),
    exerciseType: (ex.exerciseType as SessionExercise['exerciseType']) ?? 'strength',
    trackingType: ex.trackingType as SessionExercise['trackingType'],
    order: typeof ex.order === 'number' ? ex.order : idx + 1,
    notes: ex.notes as string | undefined,
    restSeconds: typeof ex.restSeconds === 'number' ? ex.restSeconds : 90,
    lastPerformance: (ex.lastPerformance as SessionExercise['lastPerformance']) ?? null,
    bestPerformance: (ex.bestPerformance as SessionExercise['bestPerformance']) ?? null,
    suggestion: (ex.suggestion as SessionExercise['suggestion']) ?? null,
    sets,
    summary: ex.summary as SessionExercise['summary'],
  };
}

export function mapWorkoutSession(raw: Record<string, unknown> | null): WorkoutSession | null {
  if (!raw) return null;
  const exercisesRaw = (raw.exercises as unknown[]) ?? [];
  const exercises = exercisesRaw.map((e, i) => mapSessionExercise(e as Record<string, unknown>, i));

  return {
    id: oid(raw.id ?? raw._id),
    name: String(raw.name ?? 'Workout'),
    status: ((raw.status as SessionStatus) || 'active') as SessionStatus,
    startedAt:
      typeof raw.startedAt === 'string'
        ? raw.startedAt
        : new Date(raw.startedAt as string | number | Date).toISOString(),
    endedAt: raw.endedAt
      ? typeof raw.endedAt === 'string'
        ? raw.endedAt
        : new Date(raw.endedAt as string | number | Date).toISOString()
      : undefined,
    durationSeconds: raw.durationSeconds as number | undefined,
    exercises,
    template: raw.template ? oid(raw.template) : undefined,
    isPlanWorkout: raw.isPlanWorkout as boolean | undefined,
    sessionSummary: raw.sessionSummary as WorkoutSession['sessionSummary'],
  };
}

export function mapTodayPlan(raw: Record<string, unknown> | null): TodayPlan | null {
  if (!raw) return null;
  const today = raw.today as Record<string, unknown> | undefined;
  const templateRaw = today?.template;
  let template: WorkoutTemplate | null = null;
  if (templateRaw && typeof templateRaw === 'object') {
    template = mapWorkoutTemplate(templateRaw as Record<string, unknown>);
  }

  return {
    planId: oid(raw.planId),
    planName: String(raw.planName ?? ''),
    currentIndex: Number(raw.currentIndex ?? 0),
    totalDays: Number(raw.totalDays ?? 0),
    skippedDays: Number(raw.skippedDays ?? 0),
    today: {
      type: (today?.type as TodayPlan['today']['type']) ?? 'rest',
      label: today?.label as string | undefined,
      template,
    },
  };
}

export function mapPlanDay(d: Record<string, unknown>): PlanDay {
  const templateRaw = d.template;
  let template: WorkoutTemplate | null = null;
  if (templateRaw && typeof templateRaw === 'object') {
    template = mapWorkoutTemplate(templateRaw as Record<string, unknown>);
  }
  return {
    order: Number(d.order ?? 0),
    type: (d.type as PlanDay['type']) ?? 'workout',
    label: d.label as string | undefined,
    template,
    templateId: templateRaw ? oid(templateRaw) : undefined,
  };
}

export function mapWorkoutPlan(doc: Record<string, unknown> | null): WorkoutPlan | null {
  if (!doc) return null;
  const daysRaw = (doc.days as unknown[]) ?? [];
  const days = daysRaw.map((d) => mapPlanDay(d as Record<string, unknown>));
  return {
    id: oid(doc._id ?? doc.id),
    name: String(doc.name ?? ''),
    days,
    currentDayIndex: Number(doc.currentDayIndex ?? 0),
    totalDays: days.length,
    isActive: !!doc.isActive,
    lastCompletedAt: doc.lastCompletedAt
      ? new Date(doc.lastCompletedAt as string | number | Date).toISOString()
      : undefined,
  };
}

export function mapDashboardPayload(raw: Record<string, unknown>): DashboardData {
  const last = raw.lastWorkout as Record<string, unknown> | null | undefined;
  return {
    streak: raw.streak as DashboardData['streak'],
    xp: raw.xp as DashboardData['xp'],
    lastWorkout: last
      ? {
          name: String(last.name ?? ''),
          date:
            typeof last.date === 'string'
              ? last.date
              : new Date(last.date as string | number | Date).toISOString(),
          duration: Number(last.duration ?? 0),
          volume: Number(last.volume ?? 0),
        }
      : null,
    weeklyVolume: Number(raw.weeklyVolume ?? 0),
    volumeByDay: (raw.volumeByDay as Record<string, number>) ?? {},
    topExercises: (raw.topExercises as DashboardData['topExercises']) ?? [],
    todayPlan: mapTodayPlan((raw.todayPlan as Record<string, unknown>) ?? null),
    isFirstTimeUser: !!raw.isFirstTimeUser,
  };
}

export function mapFinishResult(raw: Record<string, unknown>): FinishSessionResult {
  return {
    summary: raw.summary as FinishSessionResult['summary'],
    xp: raw.xp as FinishSessionResult['xp'],
    streak: raw.streak as FinishSessionResult['streak'],
    personalRecords: (raw.personalRecords as FinishSessionResult['personalRecords']) ?? [],
    message: String(raw.message ?? ''),
  };
}
