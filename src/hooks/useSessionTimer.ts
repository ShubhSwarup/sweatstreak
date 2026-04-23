import { useEffect, useRef } from 'react';
import { useSessionStore } from '../stores/session.store';

export function useSessionTimer() {
  const { hasActiveSession, sessionStatus, tickTimer, elapsedSeconds } = useSessionStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (hasActiveSession && sessionStatus === 'active') {
      intervalRef.current = setInterval(() => tickTimer(), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [hasActiveSession, sessionStatus]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return { elapsedSeconds, formattedTime: formatTime(elapsedSeconds) };
}
