import { useEffect, useRef, useState } from 'react';

export { useModeResolver } from './useModeResolver';

// ─────────────────────────────────────────────
// useSessionTimer — live elapsed time counter
// ─────────────────────────────────────────────
export function useSessionTimer(startedAt: string | null): string {
  const [elapsed, setElapsed] = useState('0:00');

  useEffect(() => {
    if (!startedAt) return;

    const tick = () => {
      const seconds = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      if (h > 0) {
        setElapsed(`${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
      } else {
        setElapsed(`${m}:${String(s).padStart(2, '0')}`);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return elapsed;
}

// ─────────────────────────────────────────────
// useRestTimer — countdown timer for rest between sets
// ─────────────────────────────────────────────
export function useRestTimer(initialSeconds: number, onComplete?: () => void) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setRemaining(initialSeconds);
    setIsRunning(true);
  };

  const skip = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setRemaining(0);
  };

  const addTime = (seconds: number) => {
    setRemaining((r) => r + seconds);
  };

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const display = `${minutes}:${String(seconds).padStart(2, '0')}`;
  const progress = remaining / initialSeconds;

  return { remaining, display, progress, isRunning, start, skip, addTime };
}

// ─────────────────────────────────────────────
// useDebounce — for search inputs
// ─────────────────────────────────────────────
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// ─────────────────────────────────────────────
// formatDuration — utility
// ─────────────────────────────────────────────
export function formatDuration(seconds: number): string {
  if (!seconds) return '0 min';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

export function formatWeight(kg: number | null | undefined): string {
  if (kg == null) return '—';
  return `${kg} kg`;
}

export function formatVolume(kg: number): string {
  return `${kg.toLocaleString()} KG`;
}
