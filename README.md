# SweatStreak — React Native (Expo) App

## Setup

```bash
npm install
npx expo start
```

## Connecting Your Backend

All API calls are in `src/api/`. Each file has:
- The real API call commented in
- A mock return active by default

**To connect your real backend:**

1. Open `src/api/client.ts` and update `BASE_URL`:
   ```ts
   const BASE_URL = 'http://YOUR_SERVER:3000/api';
   ```

2. In each API file, uncomment the real `apiClient` call and remove the mock return.

## Project Structure

```
src/
  api/          → All API calls (one file per domain)
  stores/       → Zustand state stores
  components/   → Reusable UI components
  constants/    → Theme, mock data
  hooks/        → Custom React hooks
  types/        → TypeScript interfaces
app/
  (auth)/       → Login, register, forgot password
  (tabs)/       → Main 4-tab app
    index.tsx         → Dashboard
    workouts/         → Workout hub + active session
    progress/         → Calendar + charts
    profile/          → Profile + settings + plans
```

## Key Architecture Decisions

- **Workout Hub** is a state machine — one screen, 5 modes (default/quickStart/plan/swap/resume)
- **Active Session** is fullscreen modal — tab bar hidden
- **Session Mini Banner** persists above tab bar whenever session is active/paused
- **Mock data** in `src/constants/mockData.ts` — replace with API calls per file in `src/api/`
- **Optimistic updates** in session store — UI updates immediately, syncs to backend in background

## Adding API Endpoints

Each service file in `src/api/` maps 1:1 to your Node backend routes:

| Frontend file       | Backend route prefix   |
|---------------------|------------------------|
| auth.api.ts         | /api/auth              |
| sessions.api.ts     | /api/sessions          |
| templates.api.ts    | /api/templates         |
| exercises.api.ts    | /api/exercises         |
| plans.api.ts        | /api/workoutPlan       |
| dashboard.api.ts    | /api/dashboard         |
