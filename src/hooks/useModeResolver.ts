import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useSessionStore } from '../stores/session.store';
import { usePlanStore } from '../stores/plan.store';
import { useWorkoutStore } from '../stores/workout.store';
import type { HubMode, HubContext } from '../types';

export function useModeResolver() {
  const params = useLocalSearchParams<{ mode?: HubMode; templateId?: string; planId?: string; replacingName?: string }>();
  const { hasActiveSession, sessionStatus } = useSessionStore();
  const { todayWorkout } = usePlanStore();
  const { setHubContext, hubContext } = useWorkoutStore();

  useEffect(() => {
    let resolved: HubContext = { mode: 'default', source: 'tab' };

    // Priority 1: active or paused session always wins
    if (hasActiveSession && (sessionStatus === 'active' || sessionStatus === 'paused')) {
      resolved = { mode: 'resume', source: 'tab' };
    }
    // Priority 2: explicit mode from navigation params
    else if (params.mode) {
      resolved = {
        mode: params.mode,
        templateId: params.templateId,
        planId: params.planId,
        replacingName: params.replacingName,
        source: 'dashboard',
      };
    }
    // Priority 3: plan active with today workout
    else if (todayWorkout?.today.type === 'workout') {
      resolved = {
        mode: 'plan',
        templateId: todayWorkout.today.template?.id,
        source: 'tab',
      };
    }
    // Priority 4: default
    else {
      resolved = { mode: 'default', source: 'tab' };
    }

    setHubContext(resolved);
  }, [params.mode, hasActiveSession, sessionStatus, todayWorkout]);

  return hubContext;
}
